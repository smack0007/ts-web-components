#!/usr/bin/env ts-node
import { join } from "path";
import { chdir } from "process";
import * as app from "./src/app/build";

chdir(join(__dirname));

app.build();