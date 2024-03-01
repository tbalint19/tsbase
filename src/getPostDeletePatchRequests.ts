import express from "express";
import { z } from "zod";
import filesystem from "fs/promises";
import cors from "cors";

const server = express();

server.use(cors());
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
    const countries: Country[] = JSON.parse(rawData); //Parses the raw data into an array of Country objects.
    return countries;
  } catch (error) {
    return null;
  }
};

//GET ENDPOINT
server.get("/api/countries", async (req, res) => {
  //query paramok parse-olása és validálása
  const result = QueryParamSchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json(result.error.issues);
  }
  const queryParams = result.data;

  //kiolvassuk a countrykat egy fájlból, és a megadott query paramok alapján filterezzük
  const countries = await readFile();
  if (!countries) return res.sendStatus(500);

  const filteredCountries = countries.filter((country) => {
    return (
      country.population > queryParams.min &&
      country.population < queryParams.max
    );
  });

  //a kiszűrt országokat visszaadjuk
  res.json(filteredCountries);
});

//POST ENDPOINT
server.post("/api/countries", async (req, res) => {
  const result = CreateCountrySchema.safeParse(req.body); //post requestnél az adatok a bodyba mennek - a request bodyt kell validálni és parse-olni
  if (!result.success) {
    return res.status(400).json(result.error.issues);
  }
  //beolvassuk az adatfájlban lévő országokat
  const countries = await readFile();
  if (!countries) return res.sendStatus(500);

  //létrehozunk egy random id numbert
  const randomNumber = Math.random();

  //hozzáadjuk az új országot a meglévőkhöz
  const newCountry = { ...result.data, id: randomNumber };
  countries.push(newCountry);
  //ez ugyanez: countries.push({...result.data, id: Math.random()})

  //beleírjuk a fájlba a lefrissített adatokat
  await filesystem.writeFile(
    `${__dirname}/../database.json`,
    JSON.stringify(countries, null, 2)
  );
  res.json({ id: randomNumber });
});

//DELETE ENDPOINT
server.delete("/api/countries/:id", async (req, res) => {
  //itt validálni nem kell, mert az express le tudja kezelni azokat az eseteket, amikor pl. nincs megadva name, akkor nem
  const id = +req.params.id; //Parses the id parameter from the request.
  const countries = await readFile();
  if (!countries) return res.sendStatus(500);
  const filteredCountries = countries.filter((country) => country.id !== id);
  await filesystem.writeFile(
    `${__dirname}/../database.json`,
    JSON.stringify(filteredCountries, null, 2)
  );
  res.sendStatus(200);
});

//PATCH ENDPOINT
server.patch("/api/countries/:id", async (req, res) => {
  const id = +req.params.id; //Parses the id parameter from the request.
  const countries = await readFile();
  if (!countries) return res.sendStatus(500);

  let countryToModify = countries.find((country) => country.id === id); //a find vagy egy objectet vagy egy undefined-ot ad vissza- ha nincs adott id-val rendelkező object
  if (!countryToModify) {
    return res.sendStatus(404);
  }

  //validálja a request bodyt, hogy megfelel-e a sémának, amire létre kell hozni a countryt
  const result = CreateCountrySchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json(result.error.issues);
  }

  //Checks if the current country object's id matches the id passed in the route parameters (req.params.id).
  //The result of this operation is a new array, updatedCountries, where the country with the specified id has been updated with the new data from the request body. The rest of the countries remain unchanged in the array. This updated array is then used to overwrite the existing data in the server's database file.
  const updatedCountries = countries.map((country) => {
    if (country.id === id) {
      return { ...result.data, id: id };
    }
    return country;
  });
  await filesystem.writeFile(
    `${__dirname}/../database.json`,
    JSON.stringify(updatedCountries, null, 2)
  );
  res.sendStatus(200);
});

server.listen(4001);
