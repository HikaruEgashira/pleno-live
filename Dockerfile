FROM public.ecr.aws/lambda/nodejs:20

WORKDIR ${LAMBDA_TASK_ROOT}

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile --prod

# Copy server code
COPY server ./server
COPY tsconfig.json ./

# Install dev dependencies for build
RUN pnpm install --frozen-lockfile

# Build Lambda handler
RUN pnpm add @codegenie/serverless-express && \
    npx esbuild server/lambda.ts \
    --bundle \
    --platform=node \
    --target=node20 \
    --outfile=dist/lambda.js \
    --external:aws-sdk

# Set the handler
CMD ["dist/lambda.handler"]
