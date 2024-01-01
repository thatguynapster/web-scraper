import express, { Express, NextFunction, Request, Response } from "express";
import { load } from "cheerio";
import dotenv from "dotenv";
import axios from "axios";

import { Article } from "../../../types";

dotenv.config();

const app: Express = express();

app.get("/", (_, res: Response, next: NextFunction) => {
  const url = "https://novelebook.com/";
  axios(url)
    .then((response: any) => {
      const html = response.data;

      const $ = load(html);

      const novels: Article[] = [];

      $(".book-3d", html).each((i, item) => {
        const title = $(item).find(".item-title").text();
        const url = $(item).find("a").attr("href") as string;
        const image = $(item).find("img").attr("src") as string;

        novels.push({ title, url, image });
      });

      res.json({
        success: true,
        message: "Trending Novels",
        code: 200,
        response: novels,
      });
    })
    .catch((err) => {
      return next(err);
    });
});

export default app;
