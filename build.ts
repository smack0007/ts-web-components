#!/usr/bin/env ts-node
import { chDir, join } from "./build/node";
import * as app from "./src/app/build";

chDir(join(__dirname));

app.build();