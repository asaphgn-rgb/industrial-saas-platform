#!/bin/bash
sed -i 's/\.insert([^)]*)/\.insert(payload)/g' src/services/qms-document.service.ts
