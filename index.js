import Koa from "koa";
import Router from "koa-router";
import fs from "fs";
import Bodyparser from "koa-bodyparser";
import views from "koa-views";
import path from "path";
import env from "./config/config.dev.js";

console.log(env.APP_PORT);

const app = new Koa();
const bodyparser = new Bodyparser();
const route = new Router();

// 4.配置模板引擎中间件
// views中第一个参数为放置模板文件的位置
app.use(
  views(path.join("./view"), {
    // 运用EJS模板引擎，模板文件以ejs为结尾
    extension: "ejs",
  })
);

// app.use( async ( ctx ) => {
//   let title = 'hello koa2'
//   await ctx.render('index', {
//     title,
//   })
// })

app.use(bodyparser);

route.get("/api/getTodoList", async (ctx) => {
  const fileData = await fs.readFileSync("./data.json");
  ctx.body = fileData;
});

route.post("/api/addTodoItem", async (ctx) => {
  const item = ctx.request.body;
  const fileData = await fs.readFileSync("./data.json");
  const newData = [...fileData];
  newData.push(item);
  fs.writeFile("./data.json", JSON.stringify(newData), () => null);
  ctx.body = true;
});

app.use(route.routes()).use(route.allowedMethods());

app.listen(env.APP_PORT, () =>
  console.log(`http://localhost:${env.APP_PORT}/`)
);
