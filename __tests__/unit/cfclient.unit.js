/**
 * Copyright 2017 Jarrett Bariel
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const CF = require('../../lib/cfclient');
const extend = require('util')._extend

const __defaultConfig = {
    protocol: 'http',
    host: 'api.bosh-lite.com',
    port: null,
    username: 'admin',
    password: 'admin',
    skipSslValidation: false
};

function checkConfigObjVsGivenConfig(cfgObj, config) {
    var cfg = extend({
        protocol: 'http',
        host: 'api.bosh-lite.com',
        //port: null,
        username: 'admin',
        password: 'admin',
        skipSslValidation: false
    }, config);

    cfg.port = CF.__calculatePort(cfg.port, cfg.protocol);

    expect(cfgObj).not.toBe(null);
    expect(cfgObj).not.toBe(undefined);
    expect(cfgObj.protocol).toBe(cfg.protocol);
    expect(cfgObj.host).toBe(cfg.host);
    expect(cfgObj.port).toBe(cfg.port);
    expect(cfgObj.username).toBe(cfg.username);
    expect(cfgObj.password).toBe(cfg.password);
    expect(cfgObj.skipSslValidation).toBe(cfg.skipSslValidation);
}

describe('CFClient (Unit)', function () {
    describe('CFConfig => can be created', function () {
        it('should return a config object on initialization', function () {
            var cfg = new CF.CFConfig();
            expect(cfg).not.toBe(null);
            expect(cfg).not.toBe(undefined);
        });
        it('should return reasonable defaults', function () {
            checkConfigObjVsGivenConfig(new CF.CFConfig(), {});
        });
        it('should be configurable', function () {
            var cfg = {
                protocol: 'https',
                host: 'localhost',
                port: 443,
                username: 'user',
                password: 'pass',
                skipSslValidation: true
            };
            checkConfigObjVsGivenConfig(new CF.CFConfig(cfg), cfg);
        });
        it('should use defaults when no values are given', function () {
            var cfg2 = {
                host: 'bob'
            };
            checkConfigObjVsGivenConfig(new CF.CFConfig(cfg2), cfg2);
        });
        it('should use correct port with defaults', function () {
            expect((new CF.CFConfig()).port).toBe(80);
        });
        it('should default to port 80 when protocol is http', function () {
            expect((new CF.CFConfig({ protocol: 'http' })).port).toBe(80);
        });
        it('should default to port 443 when protocol is https', function () {
            expect((new CF.CFConfig({ protocol: 'https' })).port).toBe(443);
        });
        it('should always use a given value over checking the protocol', function () {
            expect((new CF.CFConfig({ port: 123 })).port).toBe(123);
            expect((new CF.CFConfig({ protocol: 'http', port: 123 })).port).toBe(123);
            expect((new CF.CFConfig({ protocol: 'https', port: 123 })).port).toBe(123);
        });
    });
    describe('Calculate port', function () {
        it('should return 80 when no port is sent under http', function () {
            expect(CF.__calculatePort(null, 'http')).toBe(80);
        });
        it('should return 443 when no port is sent under https', function () {
            expect(CF.__calculatePort(null, 'https')).toBe(443);
        });
        it('should return given port always', function () {
            expect(CF.__calculatePort(123, 'http')).toBe(123);
            expect(CF.__calculatePort(123, 'https')).toBe(123);
        });
    });
    describe('CFClient => can be created', function () {
        it('should throw an error when not given config', function () {
            expect(() => { new CF.CFClient(); }).toThrow('Given tokens must be an instance of CFConfig');
        });
        it('should throw an error when not given a CFConfig object', function () {
            expect(() => { new CF.CFClient({}); }).toThrow('Given tokens must be an instance of CFConfig');
            expect(() => { new CF.CFClient(__defaultConfig); }).toThrow('Given tokens must be an instance of CFConfig');
        });
        it('should not be null when given a valid CFConfig object', function () {
            var cf = new CF.CFClient(new CF.CFConfig());
        });
    });
});