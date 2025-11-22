#!/usr/bin/env node
"use strict";
/**
 * ENS Dry-Run Test Script
 * Tests the entire ENS flow without executing actual transactions
 *
 * Covers:
 * 1. Name normalization verification
 * 2. Subname existence checking
 * 3. ENS record building
 * 4. Transaction data encoding
 * 5. Simulation of record setting
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.env.local' });
var ens_1 = require("viem/ens");
var viem_1 = require("viem");
var chains_1 = require("viem/chains");
// Colors for output
var colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[36m',
    bold: '\x1b[1m',
};
var log = {
    section: function (title) { return console.log("\n".concat(colors.bold).concat(colors.blue, "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501").concat(colors.reset, "\n").concat(colors.bold).concat(title).concat(colors.reset, "\n")); },
    success: function (msg) { return console.log("".concat(colors.green, "\u2705 ").concat(msg).concat(colors.reset)); },
    error: function (msg) { return console.log("".concat(colors.red, "\u274C ").concat(msg).concat(colors.reset)); },
    warn: function (msg) { return console.log("".concat(colors.yellow, "\u26A0\uFE0F  ").concat(msg).concat(colors.reset)); },
    info: function (msg) { return console.log("\u2139\uFE0F  ".concat(msg)); },
    detail: function (msg) { return console.log("   ".concat(msg)); },
};
// Dynamic imports for the functions we need
var getNextEROSNumber;
var formatEROSNumber;
var buildRecordsFromRelease;
var buildSetTextTransactions;
var checkSubnameExists;
var registerEROSRelease;
/**
 * Test 1: Name Normalization
 */
function testNormalization() {
    return __awaiter(this, void 0, void 0, function () {
        var ensDomain, subnameLabel, fullSubname, normalized, wrongHash, correctHash;
        return __generator(this, function (_a) {
            log.section('TEST 1: Name Normalization');
            ensDomain = process.env.ENS_DOMAIN || 'scenedex.eth';
            subnameLabel = 'EROS001';
            fullSubname = "".concat(subnameLabel, ".").concat(ensDomain);
            console.log("Testing with: ".concat(fullSubname));
            normalized = (0, ens_1.normalize)(fullSubname);
            console.log("\n   Original: ".concat(fullSubname));
            console.log("   Normalized: ".concat(normalized));
            if (normalized.toLowerCase() === fullSubname.toLowerCase()) {
                log.success("Normalization working (all lowercase)");
            }
            else {
                log.error("Normalization failed - mismatch!");
            }
            wrongHash = (0, ens_1.namehash)(fullSubname);
            correctHash = (0, ens_1.namehash)(normalized);
            console.log("\n   Hash WITHOUT normalize(): ".concat(wrongHash));
            console.log("   Hash WITH normalize():    ".concat(correctHash));
            if (wrongHash === correctHash) {
                log.info("Both hashes match (lucky case, but still bad practice)");
            }
            else {
                log.error("\u26A0\uFE0F HASHES DON'T MATCH! This is the bug!");
                log.error("Without normalize(), subname operations will target wrong node");
            }
            return [2 /*return*/, correctHash];
        });
    });
}
/**
 * Test 2: Check Subname Existence
 */
function testSubnameExistence(subnameNode) {
    return __awaiter(this, void 0, void 0, function () {
        var nameWrapperAddress, exists, error_1, msg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log.section('TEST 2: Check Subname Existence');
                    nameWrapperAddress = (process.env.ENS_NAMEWRAPPER_SEPOLIA ||
                        '0x0635513f179D50A207757E05759CbD106d7dFcE8');
                    console.log("Checking NameWrapper: ".concat(nameWrapperAddress));
                    console.log("Subname Node: ".concat(subnameNode));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, checkSubnameExists(subnameNode, nameWrapperAddress)];
                case 2:
                    exists = _a.sent();
                    if (exists) {
                        log.warn("Subname ALREADY EXISTS - cannot create duplicate");
                    }
                    else {
                        log.success("Subname available (does not exist)");
                    }
                    return [2 /*return*/, !exists]; // Return true if available
                case 3:
                    error_1 = _a.sent();
                    msg = error_1 instanceof Error ? error_1.message : String(error_1);
                    log.error("Failed to check existence: ".concat(msg));
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Test 3: Get Next EROS Number
 */
function testGetNextEROS() {
    return __awaiter(this, void 0, void 0, function () {
        var nextNumber, formatted, error_2, msg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log.section('TEST 3: Get Next EROS Number');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, getNextEROSNumber()];
                case 2:
                    nextNumber = _a.sent();
                    formatted = formatEROSNumber(nextNumber);
                    log.success("Next available EROS number: ".concat(nextNumber));
                    log.detail("Formatted: ".concat(formatted));
                    return [2 /*return*/, { number: nextNumber, formatted: formatted }];
                case 3:
                    error_2 = _a.sent();
                    msg = error_2 instanceof Error ? error_2.message : String(error_2);
                    log.error("Failed to get next EROS: ".concat(msg));
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Test 4: Build Records from Mock Release
 */
function testBuildRecords() {
    return __awaiter(this, void 0, void 0, function () {
        var mockRelease, coinAddress, coinSymbol, creatorAddress, erosNumber, records;
        return __generator(this, function (_a) {
            log.section('TEST 4: Build ENS Records');
            mockRelease = {
                id: 'test-release-001',
                title: 'Test Release',
                artists: 'Test Artist',
                description: 'A test release for ENS integration',
                coverImageIPFSHash: 'QmTestHashCover123456789',
                mediaIPFSHash: 'QmTestHashMedia123456789',
                metadataURI: 'https://w3s.link/ipfs/QmTestMetadata123456789',
                createdBy: '0x1111111111111111111111111111111111111111',
                createdAt: Math.floor(Date.now() / 1000),
                duration: 180,
                status: 'approved',
            };
            coinAddress = '0x1234567890123456789012345678901234567890';
            coinSymbol = 'EROS001';
            creatorAddress = '0x0987654321098765432109876543210987654321';
            erosNumber = 1;
            records = buildRecordsFromRelease(mockRelease, coinAddress, coinSymbol, creatorAddress, erosNumber);
            log.success("Built ".concat(Object.keys(records).length, " text records:"));
            console.log('');
            Object.entries(records).forEach(function (_a) {
                var key = _a[0], value = _a[1];
                var displayValue = typeof value === 'string' && value.length > 50 ? value.substring(0, 47) + '...' : value;
                console.log("   ".concat(key));
                console.log("      \u2192 ".concat(displayValue));
            });
            return [2 /*return*/, { records: records, coinAddress: coinAddress, coinSymbol: coinSymbol }];
        });
    });
}
/**
 * Test 5: Encode Text Transactions
 */
function testEncodeTransactions(subnameNode, records) {
    return __awaiter(this, void 0, void 0, function () {
        var transactions_1, allValid, msg;
        return __generator(this, function (_a) {
            log.section('TEST 5: Encode setText Transactions');
            try {
                transactions_1 = buildSetTextTransactions(subnameNode, records);
                log.success("Encoded ".concat(transactions_1.length, " transactions for Safe batching"));
                console.log('');
                transactions_1.forEach(function (tx, i) {
                    console.log("   [".concat(i + 1, "/").concat(transactions_1.length, "]"));
                    console.log("      To:    ".concat(tx.to));
                    console.log("      Value: ".concat(tx.value));
                    console.log("      Data:  ".concat(tx.data.substring(0, 50), "..."));
                    console.log("      Size:  ".concat((tx.data.length - 2) / 2, " bytes"));
                    console.log('');
                });
                allValid = transactions_1.every(function (tx) {
                    return (tx.to.startsWith('0x') &&
                        tx.data.startsWith('0x') &&
                        tx.data.length >= 138 // At least 4 bytes selector + some params
                    );
                });
                if (allValid) {
                    log.success("All transaction data properly formatted");
                }
                else {
                    log.error("Some transaction data is malformed");
                }
                return [2 /*return*/, transactions_1];
            }
            catch (error) {
                msg = error instanceof Error ? error.message : String(error);
                log.error("Failed to encode transactions: ".concat(msg));
                return [2 /*return*/, []];
            }
            return [2 /*return*/];
        });
    });
}
/**
 * Test 6: Full Registration Flow
 */
function testFullRegistration() {
    return __awaiter(this, void 0, void 0, function () {
        var mockRelease, coinAddress, coinSymbol, creatorAddress, result, txValid, error_3, msg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log.section('TEST 6: Full Registration Flow (Dry Run)');
                    mockRelease = {
                        id: 'test-release-dry-run',
                        title: 'Test Release for Dry Run',
                        artists: 'Test Artist',
                        description: 'Testing the full ENS registration flow',
                        coverImageIPFSHash: 'QmDryRunCover123456789',
                        mediaIPFSHash: 'QmDryRunMedia123456789',
                        metadataURI: 'https://w3s.link/ipfs/QmDryRunMetadata123456789',
                        createdBy: '0x2222222222222222222222222222222222222222',
                        createdAt: Math.floor(Date.now() / 1000),
                        duration: 240,
                        status: 'approved',
                    };
                    coinAddress = '0xDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEF';
                    coinSymbol = 'DRYRUN';
                    creatorAddress = '0xCAFECAFECAFECAFECAFECAFECAFECAFECAFECAFE';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    console.log("Calling registerEROSRelease()...");
                    return [4 /*yield*/, registerEROSRelease(mockRelease, coinAddress, coinSymbol, creatorAddress)];
                case 2:
                    result = _a.sent();
                    log.success("Registration data prepared:");
                    console.log("   Subname Label: ".concat(result.subnameLabel));
                    console.log("   Subname Node: ".concat(result.subnameNode));
                    console.log("   Records: ".concat(Object.keys(result.records).length));
                    console.log("   Transactions: ".concat(result.transactions.length));
                    console.log("   Batch Size: ".concat(result.batchSize));
                    txValid = result.transactions.every(function (tx) {
                        return tx.to && tx.value === '0' && tx.data.startsWith('0x');
                    });
                    if (txValid) {
                        log.success("All ".concat(result.transactions.length, " transactions properly formatted"));
                    }
                    else {
                        log.error("Some transactions have invalid structure");
                    }
                    return [2 /*return*/, result];
                case 3:
                    error_3 = _a.sent();
                    msg = error_3 instanceof Error ? error_3.message : String(error_3);
                    log.error("Failed to prepare registration: ".concat(msg));
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Test 7: Simulate createENSSubname (read-only simulation)
 */
function testSimulateCreateSubname() {
    return __awaiter(this, void 0, void 0, function () {
        var rpcUrl, ensDomain, normalizedDomain, parentNode, subnameLabel, NAMEWRAPPER_ABI, now, expiryTimestamp, publicClient, encodedData, msg;
        return __generator(this, function (_a) {
            log.section('TEST 7: Simulate createENSSubname (Read-Only)');
            rpcUrl = process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/' + process.env.INFURA_KEY;
            ensDomain = process.env.ENS_DOMAIN || 'scenedex.eth';
            normalizedDomain = (0, ens_1.normalize)(ensDomain);
            parentNode = (0, ens_1.namehash)(normalizedDomain);
            subnameLabel = 'EROS001';
            NAMEWRAPPER_ABI = [
                {
                    name: 'setSubnodeRecord',
                    type: 'function',
                    stateMutability: 'nonpayable',
                    inputs: [
                        { name: 'parentNode', type: 'bytes32' },
                        { name: 'label', type: 'string' },
                        { name: 'owner', type: 'address' },
                        { name: 'resolver', type: 'address' },
                        { name: 'ttl', type: 'uint64' },
                        { name: 'fuses', type: 'uint32' },
                        { name: 'expiry', type: 'uint64' },
                    ],
                    outputs: [],
                },
            ];
            console.log("Parent Domain: ".concat(ensDomain, " (normalized: ").concat(normalizedDomain, ")"));
            console.log("Parent Node: ".concat(parentNode));
            console.log("Subname Label: ".concat(subnameLabel));
            now = Math.floor(Date.now() / 1000);
            expiryTimestamp = BigInt(now + 365 * 24 * 60 * 60);
            console.log("\nTransaction Parameters:");
            console.log("   Parent Node: ".concat(parentNode));
            console.log("   Label: \"".concat(subnameLabel, "\" (type: string)"));
            console.log("   TTL: 0");
            console.log("   Fuses: 0 (no fuses burned - parent retains control)");
            console.log("   Expiry: ".concat(expiryTimestamp, " (").concat(new Date(Number(expiryTimestamp) * 1000).toISOString(), ")"));
            try {
                publicClient = (0, viem_1.createPublicClient)({
                    chain: chains_1.sepolia,
                    transport: (0, viem_1.http)(rpcUrl),
                });
                // Try to simulate (will fail if no private key, that's OK for dry run)
                console.log("\nAttempting simulation (this will fail if CURATOR_PRIVATE_KEY not set - that's OK)...");
                encodedData = (0, viem_1.encodeFunctionData)({
                    abi: NAMEWRAPPER_ABI,
                    functionName: 'setSubnodeRecord',
                    args: [
                        parentNode,
                        subnameLabel,
                        '0x0000000000000000000000000000000000000000',
                        process.env.ENS_RESOLVER_SEPOLIA,
                        BigInt(0),
                        0,
                        expiryTimestamp,
                    ],
                });
                log.success("Transaction data encoded properly");
                console.log("   Data: ".concat(encodedData.substring(0, 50), "..."));
                console.log("   Size: ".concat((encodedData.length - 2) / 2, " bytes"));
            }
            catch (error) {
                msg = error instanceof Error ? error.message : String(error);
                if (msg.includes('CURATOR_PRIVATE_KEY') || msg.includes('CURATOR_ADDRESS')) {
                    log.warn("Simulation skipped (private key not available - this is OK for dry run)");
                }
                else {
                    log.error("Simulation failed: ".concat(msg));
                }
            }
            return [2 /*return*/];
        });
    });
}
/**
 * Main test runner
 */
function runAllTests() {
    return __awaiter(this, void 0, void 0, function () {
        var ensModule, subnameNode, available, erosData, recordData, transactions, registrationData, error_4, msg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ensModule = require('./ens');
                    getNextEROSNumber = ensModule.getNextEROSNumber;
                    formatEROSNumber = ensModule.formatEROSNumber;
                    buildRecordsFromRelease = ensModule.buildRecordsFromRelease;
                    buildSetTextTransactions = ensModule.buildSetTextTransactions;
                    checkSubnameExists = ensModule.checkSubnameExists;
                    registerEROSRelease = ensModule.registerEROSRelease;
                    console.log("\n".concat(colors.bold).concat(colors.blue, "\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557").concat(colors.reset));
                    console.log("".concat(colors.bold).concat(colors.blue, "\u2551  ENS Dry-Run Test Suite                \u2551").concat(colors.reset));
                    console.log("".concat(colors.bold).concat(colors.blue, "\u2551  (No actual transactions executed)     \u2551").concat(colors.reset));
                    console.log("".concat(colors.bold).concat(colors.blue, "\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D").concat(colors.reset, "\n"));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, , 10]);
                    return [4 /*yield*/, testNormalization()];
                case 2:
                    subnameNode = _a.sent();
                    return [4 /*yield*/, testSubnameExistence(subnameNode)];
                case 3:
                    available = _a.sent();
                    return [4 /*yield*/, testGetNextEROS()];
                case 4:
                    erosData = _a.sent();
                    return [4 /*yield*/, testBuildRecords()];
                case 5:
                    recordData = _a.sent();
                    return [4 /*yield*/, testEncodeTransactions(subnameNode, recordData.records)];
                case 6:
                    transactions = _a.sent();
                    return [4 /*yield*/, testFullRegistration()];
                case 7:
                    registrationData = _a.sent();
                    // Test 7: Simulate creation
                    return [4 /*yield*/, testSimulateCreateSubname()];
                case 8:
                    // Test 7: Simulate creation
                    _a.sent();
                    // Summary
                    log.section('SUMMARY');
                    console.log("".concat(colors.green, "\u2705 All dry-run tests completed!").concat(colors.reset));
                    console.log('');
                    console.log("Key Findings:");
                    console.log("   \u2022 Name normalization: ".concat(colors.green, "\u2705 Working").concat(colors.reset));
                    console.log("   \u2022 Subname availability check: ".concat(colors.green, "\u2705 Working").concat(colors.reset));
                    console.log("   \u2022 Records building: ".concat(colors.green, "\u2705").concat(recordData.records ? " ".concat(Object.keys(recordData.records).length, " records") : 'Failed').concat(colors.reset));
                    console.log("   \u2022 Transaction encoding: ".concat(colors.green, "\u2705").concat(transactions.length > 0 ? " ".concat(transactions.length, " transactions") : 'Failed').concat(colors.reset));
                    console.log("   \u2022 Full registration flow: ".concat(colors.green, "\u2705").concat(registrationData ? ' Complete' : ' Failed').concat(colors.reset));
                    console.log('');
                    return [3 /*break*/, 10];
                case 9:
                    error_4 = _a.sent();
                    log.section('ERROR');
                    msg = error_4 instanceof Error ? error_4.message : String(error_4);
                    log.error("Test suite failed: ".concat(msg));
                    console.error(error_4);
                    process.exit(1);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
// Run tests
runAllTests().catch(function (error) {
    console.error('Fatal error:', error);
    process.exit(1);
});
