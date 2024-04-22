import { Module } from "@nestjs/common";

import { HelloController } from "./hello-controller.ts";

@Module({
  imports: [],
  controllers: [HelloController]
})
export class AppModule {}
