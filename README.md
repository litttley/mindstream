# mindstream

[![Build Status](https://travis-ci.org/Wadjetz/mindstream.svg?branch=master)](https://travis-ci.org/Wadjetz/mindstream)

## Screenshot

![Screenshot](https://i.ibb.co/WVfXD3D/screenshot.png)

## Setup Diesel_cli
```sh
cargo install diesel_cli --no-default-features --features postgres --force
```

## SQL migration
```sh
diesel migration run
```

## Revert SQL migration
```sh
diesel migration redo
```

## Generate schema
```sh
diesel print-schema > src/schema.rs
```

## Linux dependencies
```sh
apt-get install build-essential pkg-config libssl-dev libpq-dev
```
