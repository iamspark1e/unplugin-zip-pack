import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { exec } from 'child_process';
import util from 'util'
import { rmSync, statSync, accessSync, constants } from 'fs';
import path from 'path';
const promisedExec = util.promisify(exec);

function checkFileExists(filePath: string) {
  if(!filePath) return false;
  try {
    accessSync(filePath, constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

describe('Test building zip file', () => {
  let zippedFilePath: string;
  beforeAll(async () => {
    // clean if run test before
    zippedFilePath = path.resolve(__dirname, 'example', 'test-result.zip');
    if (checkFileExists(zippedFilePath)) rmSync(zippedFilePath);
    await promisedExec('vite build');
  })

  it('a test-result.zip should be generated in test/example dir', async () => {
    if (!zippedFilePath) throw new Error("beforeAll generation failed");
    let existResult = checkFileExists(zippedFilePath);
    expect(existResult).toBe(true);
  })

  it('test-result.zip, its size should not be zero', async () => {
    if (!zippedFilePath) throw new Error("beforeAll generation failed");
    let data = statSync(zippedFilePath);
    console.log(`[unplugin-zip-pack]unit-test: generated size: ${data.size}`)
    expect(data.size).toBeGreaterThan(0);
  })

  afterAll(async () => {
    // clean if run test after
    if (zippedFilePath && statSync(zippedFilePath)) {
      rmSync(zippedFilePath);
    }
  })
})
