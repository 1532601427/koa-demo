import Koa from "koa";
import Router from "koa-router";
import fs from "fs";
import Bodyparser from "koa-bodyparser";
import views from "koa-views";
import path from "path";
import env from "./config/config.dev.js";
import serve from "koa-static";

console.log(env.APP_PORT);

const app = new Koa();
const bodyparser = new Bodyparser();
const route = new Router();

// views中第一个参数为放置模板文件的位置
app.use(
  views(path.join("./view"), {
    // 运用EJS模板引擎，模板文件以ejs为结尾
    extension: "ejs",
  })
);

route.get("/", async (ctx) => {
  await ctx.render("./index.ejs");
});

app.use(bodyparser);

route.get("/api/getTodoList.json", async (ctx) => {
  const fileData = await fs.readFileSync("./data.json");
  ctx.body = fileData;
});

route.post("/api/addTodoItem.json", async (ctx) => {
  const item = ctx.request.body;
  const fileData = await fs.readFileSync("./data.json", { encoding: "utf-8" });
  const newData = JSON.parse(fileData);
  newData.push(item);
  console.log(fileData, ctx.request);
  fs.writeFile("./data.json", JSON.stringify(newData), () => null);
  //返回值
  ctx.body = true;
});

// 静态资源
app.use(serve("./page"));

app.use(route.routes()).use(route.allowedMethods());

app.listen(env.APP_PORT, () =>
  console.log(`http://localhost:${env.APP_PORT}/`)
);
