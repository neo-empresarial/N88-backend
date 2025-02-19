import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import * as cookieParser from 'cookie-parser';
import cookieParser from 'cookie-parser';

// const allowedOrigins = ["https://n88-frontend.vercel.app", "https://www.n88-frontend.vercel.app", "http://localhost:3000", "https://n88-frontend-l413chunz-kaique-valentim-costa-souzas-projects.vercel.app"];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
    "https://n88-frontend.vercel.app",
    "https://www.n88-frontend.vercel.app",
    "http://localhost:3000",
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true
  }));
  app.use(cookieParser()); //Cookie parser middleware
  await app.listen(8000);
}
bootstrap();
