# AWS CDK Group01 Project

A comprehensive AWS CDK TypeScript project demonstrating various AWS services, deployment patterns, and infrastructure management concepts.

## Project Overview

This project contains multiple CDK stacks organized by functionality, demonstrating:
- Microservices architecture
- Asset management (S3 and Docker)
- Environment-specific configurations
- Permissions and security patterns
- Resource management and tagging
- VPC and networking infrastructure

## Project Structure

```
lib/
├── assets/          # Asset management stacks
├── constructs/      # Reusable CDK constructs
├── environments/    # Environment-specific configurations
├── permissions/     # IAM and security-related stacks
├── resources/       # Core infrastructure resources
├── stacks/          # Main application stacks
└── tags/           # Tagging strategies and implementations
```

## Available Stacks

### 🚀 Application Stacks (`lib/stacks/`)

#### MicroserviceAStack
- **File**: `microservice-a.stack.ts`
- **Purpose**: Deploys a Lambda function for Microservice A
- **Resources**:
  - Lambda Function (Node.js 20.x runtime)
  - Function name: `MicroserviceAFunction`
  - Handler: `microservice-a-function.handler`

#### MicroserviceBStack
- **File**: `microservice-b.stack.ts`
- **Purpose**: Deploys a Lambda function for Microservice B
- **Resources**:
  - Lambda Function (Node.js 20.x runtime)
  - Function name: `MicroserviceBFunction`
  - Handler: `microservice-b-function.handler`

#### Microservice Grouping & Nested Stacks
- **Files**: `microservice-grouping.ts`, `microservice-nested.ts`
- **Purpose**: Demonstrates stack composition and organization patterns

### 🔐 Permissions Stack (`lib/permissions/`)

#### PermissionsStack
- **File**: `permissions.stack.ts`
- **Purpose**: Demonstrates IAM policies, DynamoDB integration, and environment-specific configurations
- **Resources**:
  - DynamoDB Table (`users`) with configurable removal policy
  - Lambda Function with DynamoDB permissions
  - IAM Policy Statements for DynamoDB access
  - Environment variable configuration
- **Features**:
  - Environment-aware removal policies (destroy for dev/test, retain for prod)
  - Custom IAM policies vs managed permissions

### 🌍 Environment Stack (`lib/environments/`)

#### EnvironmentStack
- **File**: `environment.stack.ts`
- **Purpose**: Demonstrates nested stack architecture
- **Resources**:
  - **MicroserviceApiStack** (Nested): API Lambda function
  - **MicroserviceDatabaseStack** (Nested): DynamoDB table for microservices
- **Pattern**: Parent stack orchestrating multiple nested stacks

### 📦 Asset Management (`lib/assets/`)

#### S3AssetsStack
- **File**: `01-s3.ts`
- **Purpose**: Demonstrates S3-based Lambda asset deployment
- **Resources**:
  - Lambda Function using S3 asset deployment
  - Node.js 22.x runtime
  - Asset bundling from local functions directory

#### DockerAssetsStack
- **File**: `02-docker.ts`
- **Purpose**: Demonstrates containerized application deployment
- **Resources**:
  - ECS Fargate Task Definition
  - Docker Image Asset (ECR)
  - Container configuration (1024 MiB memory, 512 CPU)

### 🏗️ Infrastructure Resources (`lib/resources/`)

#### VpcAlbStack
- **File**: `01-vpc-alb.ts`
- **Purpose**: Core networking infrastructure
- **Resources**:
  - VPC with 2 Availability Zones
  - Application Load Balancer
  - IAM Role integration

#### Lambda-DynamoDB Integration
- **File**: `02-lambda-dynamo.ts`
- **Purpose**: Serverless data processing patterns

#### Removal Policies
- **File**: `03-removal-policy.ts`
- **Purpose**: Demonstrates resource lifecycle management

### 🏷️ Tagging Strategies (`lib/tags/`)

#### Tagging Implementation
- **Files**: `01-tag.ts`, `02-priority.ts`
- **Purpose**: Demonstrates resource tagging and prioritization strategies
- **Use Cases**:
  - Cost allocation
  - Environment identification
  - Resource management
  - Compliance tracking

### 🔧 Constructs (`lib/constructs/`)

#### Custom Constructs
- **File**: `construct.stack.ts`
- **Purpose**: Reusable CDK constructs for common patterns

## Deployment Commands

### Basic Commands
```bash
# Install dependencies
npm install

# Compile TypeScript
npm run build

# Watch for changes
npm run watch

# Run tests
npm run test

# Synthesize CloudFormation templates
npx cdk synth

# Show differences
npx cdk diff

# Deploy all stacks
npx cdk deploy --all

# Deploy specific stack
npx cdk deploy <StackName>
```

### Stack-Specific Deployment
```bash
# Deploy microservice stacks
npx cdk deploy MicroserviceAStack
npx cdk deploy MicroserviceBStack

# Deploy asset stacks
npx cdk deploy S3AssetsStack
npx cdk deploy DockerAssetsStack

# Deploy infrastructure
npx cdk deploy VpcAlbStack
npx cdk deploy PermissionsStack

# Deploy environment stack (includes nested stacks)
npx cdk deploy EnvironmentStack
```

## Environment Configuration

The project supports multiple environments through environment-specific configurations:

- **Development**: Resources with destroy removal policy for cost optimization
- **Test**: Similar to development with additional testing configurations
- **Production**: Resources with retain removal policy for data protection

## Key Features Demonstrated

1. **Microservices Architecture**: Independent service deployment
2. **Asset Management**: Both S3 and Docker-based deployments
3. **Security**: IAM policies and DynamoDB permissions
4. **Networking**: VPC and Load Balancer configuration
5. **Environment Management**: Environment-specific resource policies
6. **Nested Stacks**: Hierarchical stack organization
7. **Tagging Strategies**: Resource organization and management
8. **Removal Policies**: Lifecycle management for different environments

## Prerequisites

- AWS CLI configured with appropriate credentials
- Node.js 18+ installed
- AWS CDK CLI installed (`npm install -g aws-cdk`)
- Docker installed (for DockerAssetsStack)

## Project Configuration

The project uses:
- **CDK Version**: 2.198.0
- **TypeScript**: 5.6.3
- **Node.js Runtime**: 20.x/22.x (varies by stack)
- **Testing**: Jest framework

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure AWS credentials
4. Build the project: `npm run build`
5. Review stack outputs: `npx cdk synth`
6. Deploy stacks: `npx cdk deploy --all`

## Useful Commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
