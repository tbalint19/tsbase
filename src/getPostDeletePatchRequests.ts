import express from "express";
import { z } from "zod";
import filesystem from "fs/promises";
import cors from "cors"

const server = express();

server.use(cors())
server.use(express.json()); //ezért azért fontos, hogy idekerüljön, hogy ha érkezik egy req, aminek a body-jában json van, akkor azt automatikusan parse-olja

const QueryParamSchema = z.object({
  min: z.coerce.number(),
  max: z.coerce.number(),
});

const CountrySchema = z.object({
  id: z.number(),
  name: z.string(),
  population: z.number(),
});

type Country = z.infer<typeof CountrySchema>;

const CreateCountrySchema = z.object({
  name: z.string(),
  population: z.number(),
});

const readFile = async () => {
  try {
    const rawData = await filesystem.readFile(
    `${__dirname}/../database.json`,
    `utf-8`
  );
  const countries: Country[] = JSON.parse(rawData);
  return countries;
    }catch(error) {
      return null
    }
};

server.get("/api/countries", async (req, res) => {
  const result = QueryParamSchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json(result.error.issues);
  }

  const countries = await readFile();
if (!countries) return res.sendStatus(500)
  const queryParams = result.data;
  const filteredCountries = countries.filter((country) => {
    return (
      country.population > queryParams.min &&
      country.population < queryParams.max
    );
  });
  res.json(filteredCountries);
});

server.post("/api/countries", async (req, res) => {
  const result = CreateCountrySchema.safeParse(req.body); //post requestnél az adatok a bodyba mennek
  if (!result.success) {
    return res.status(400).json(result.error.issues);
  }

  const countries = await readFile();
if (!countries) return res.sendStatus(500)
  const randomNumber = Math.random()
  const newCountry = { ...result.data, id: randomNumber};
  countries.push(newCountry);
  //ez ugyanez: countries.push({...result.data, id: Math.random()})

  await filesystem.writeFile(
    `${__dirname}/../database.json`,
    JSON.stringify(countries, null, 2)
  );
  res.json({id: randomNumber});
});

server.delete("/api/countries/:id", async (req, res) => {
  //itt validálni nem kell, mert az express le tudja kezelni azokat az eseteket, amikor pl. nincs megadva name, akkor nem
  const id = +req.params.id;
  const countries = await readFile();
  if (!countries) return res.sendStatus(500)
  const filteredCountries = countries.filter((country) => country.id !== id);
  await filesystem.writeFile(
    `${__dirname}/../database.json`,
    JSON.stringify(filteredCountries, null, 2)
  );
  res.sendStatus(200)
});

server.patch("/api/countries/:id", async (req, res) => {
  const id = +req.params.id;
  const countries = await readFile();
  if (!countries) return res.sendStatus(500)
  let countryToModify = countries.find((country) => country.id === id); //a find vagy egy objectet vagy egy undefined-ot ad vissza- ha nincs adott id-val rendelkező object

  if (!countryToModify) {
    return res.sendStatus(404);
  }
  const result = CreateCountrySchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json(result.error.issues);
  }
  const updatedCountries = countries.map(country => {
    if (country.id === id) {
      return {...result.data, id: id}
    }
    return country
  })
  await filesystem.writeFile(
    `${__dirname}/../database.json`,
    JSON.stringify(updatedCountries, null, 2)
  );
  res.sendStatus(200)
});

server.listen(4001);
