#!/usr/bin/env node

import { App } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { BucketStack } from "./lib/bucket.stack";

const app = new App()

new BucketStack(app, "BucketStack")