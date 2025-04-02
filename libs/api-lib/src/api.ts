/* tslint:disable */
/* eslint-disable */
/**
 * ABC Admin API
 * API for Animal Bite Clinic Admin App
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import type { Configuration } from './configuration';
import type { AxiosPromise, AxiosInstance, RawAxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from './common';
import type { RequestArgs } from './base';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, BaseAPI, RequiredError, operationServerMap } from './base';

/**
 * 
 * @export
 * @interface AuthControllerLogin200Response
 */
export interface AuthControllerLogin200Response {
    /**
     * 
     * @type {string}
     * @memberof AuthControllerLogin200Response
     */
    'access_token'?: string;
    /**
     * 
     * @type {AuthControllerLogin200ResponseUser}
     * @memberof AuthControllerLogin200Response
     */
    'user'?: AuthControllerLogin200ResponseUser;
}
/**
 * 
 * @export
 * @interface AuthControllerLogin200ResponseUser
 */
export interface AuthControllerLogin200ResponseUser {
    /**
     * 
     * @type {string}
     * @memberof AuthControllerLogin200ResponseUser
     */
    'id'?: string;
    /**
     * 
     * @type {string}
     * @memberof AuthControllerLogin200ResponseUser
     */
    'email'?: string;
    /**
     * 
     * @type {string}
     * @memberof AuthControllerLogin200ResponseUser
     */
    'role'?: string;
}
/**
 * 
 * @export
 * @interface CreatePatientDto
 */
export interface CreatePatientDto {
    /**
     * 
     * @type {string}
     * @memberof CreatePatientDto
     */
    'firstName': string;
    /**
     * 
     * @type {string}
     * @memberof CreatePatientDto
     */
    'middleName': string;
    /**
     * 
     * @type {string}
     * @memberof CreatePatientDto
     */
    'lastName': string;
    /**
     * 
     * @type {string}
     * @memberof CreatePatientDto
     */
    'dateOfBirth': string;
    /**
     * 
     * @type {string}
     * @memberof CreatePatientDto
     */
    'sex': CreatePatientDtoSexEnum;
    /**
     * 
     * @type {string}
     * @memberof CreatePatientDto
     */
    'address': string;
    /**
     * 
     * @type {string}
     * @memberof CreatePatientDto
     */
    'email': string;
}

export const CreatePatientDtoSexEnum = {
    Male: 'male',
    Female: 'female',
    Other: 'other'
} as const;

export type CreatePatientDtoSexEnum = typeof CreatePatientDtoSexEnum[keyof typeof CreatePatientDtoSexEnum];

/**
 * 
 * @export
 * @interface CreateUserDto
 */
export interface CreateUserDto {
    /**
     * 
     * @type {string}
     * @memberof CreateUserDto
     */
    'username': string;
    /**
     * 
     * @type {string}
     * @memberof CreateUserDto
     */
    'email': string;
    /**
     * 
     * @type {string}
     * @memberof CreateUserDto
     */
    'password': string;
    /**
     * First name
     * @type {string}
     * @memberof CreateUserDto
     */
    'firstName': string;
    /**
     * Last name
     * @type {string}
     * @memberof CreateUserDto
     */
    'lastName': string;
    /**
     * User role
     * @type {string}
     * @memberof CreateUserDto
     */
    'role': CreateUserDtoRoleEnum;
    /**
     * Whether the user can log in to the system
     * @type {boolean}
     * @memberof CreateUserDto
     */
    'isActive': boolean;
}

export const CreateUserDtoRoleEnum = {
    Admin: 'admin'
} as const;

export type CreateUserDtoRoleEnum = typeof CreateUserDtoRoleEnum[keyof typeof CreateUserDtoRoleEnum];

/**
 * 
 * @export
 * @interface LoginDto
 */
export interface LoginDto {
    /**
     * 
     * @type {string}
     * @memberof LoginDto
     */
    'email': string;
    /**
     * 
     * @type {string}
     * @memberof LoginDto
     */
    'password': string;
}

/**
 * AppApi - axios parameter creator
 * @export
 */
export const AppApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        appControllerGetData: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * AppApi - functional programming interface
 * @export
 */
export const AppApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = AppApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async appControllerGetData(options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.appControllerGetData(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['AppApi.appControllerGetData']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * AppApi - factory interface
 * @export
 */
export const AppApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = AppApiFp(configuration)
    return {
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        appControllerGetData(options?: RawAxiosRequestConfig): AxiosPromise<void> {
            return localVarFp.appControllerGetData(options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * AppApi - object-oriented interface
 * @export
 * @class AppApi
 * @extends {BaseAPI}
 */
export class AppApi extends BaseAPI {
    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AppApi
     */
    public appControllerGetData(options?: RawAxiosRequestConfig) {
        return AppApiFp(this.configuration).appControllerGetData(options).then((request) => request(this.axios, this.basePath));
    }
}



/**
 * AuthApi - axios parameter creator
 * @export
 */
export const AuthApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary User login
         * @param {LoginDto} loginDto 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        authControllerLogin: async (loginDto: LoginDto, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'loginDto' is not null or undefined
            assertParamExists('authControllerLogin', 'loginDto', loginDto)
            const localVarPath = `/api/auth/login`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(loginDto, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * AuthApi - functional programming interface
 * @export
 */
export const AuthApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = AuthApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary User login
         * @param {LoginDto} loginDto 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async authControllerLogin(loginDto: LoginDto, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<AuthControllerLogin200Response>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.authControllerLogin(loginDto, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['AuthApi.authControllerLogin']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * AuthApi - factory interface
 * @export
 */
export const AuthApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = AuthApiFp(configuration)
    return {
        /**
         * 
         * @summary User login
         * @param {LoginDto} loginDto 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        authControllerLogin(loginDto: LoginDto, options?: RawAxiosRequestConfig): AxiosPromise<AuthControllerLogin200Response> {
            return localVarFp.authControllerLogin(loginDto, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * AuthApi - object-oriented interface
 * @export
 * @class AuthApi
 * @extends {BaseAPI}
 */
export class AuthApi extends BaseAPI {
    /**
     * 
     * @summary User login
     * @param {LoginDto} loginDto 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthApi
     */
    public authControllerLogin(loginDto: LoginDto, options?: RawAxiosRequestConfig) {
        return AuthApiFp(this.configuration).authControllerLogin(loginDto, options).then((request) => request(this.axios, this.basePath));
    }
}



/**
 * PatientsApi - axios parameter creator
 * @export
 */
export const PatientsApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Create a new patient
         * @param {CreatePatientDto} createPatientDto 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        patientsControllerCreate: async (createPatientDto: CreatePatientDto, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'createPatientDto' is not null or undefined
            assertParamExists('patientsControllerCreate', 'createPatientDto', createPatientDto)
            const localVarPath = `/api/patients`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearer required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(createPatientDto, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Get all patients
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        patientsControllerFindAll: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/patients`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearer required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Get a patient by ID
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        patientsControllerFindOne: async (id: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('patientsControllerFindOne', 'id', id)
            const localVarPath = `/api/patients/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearer required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * PatientsApi - functional programming interface
 * @export
 */
export const PatientsApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = PatientsApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary Create a new patient
         * @param {CreatePatientDto} createPatientDto 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async patientsControllerCreate(createPatientDto: CreatePatientDto, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.patientsControllerCreate(createPatientDto, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['PatientsApi.patientsControllerCreate']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary Get all patients
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async patientsControllerFindAll(options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.patientsControllerFindAll(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['PatientsApi.patientsControllerFindAll']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary Get a patient by ID
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async patientsControllerFindOne(id: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.patientsControllerFindOne(id, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['PatientsApi.patientsControllerFindOne']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * PatientsApi - factory interface
 * @export
 */
export const PatientsApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = PatientsApiFp(configuration)
    return {
        /**
         * 
         * @summary Create a new patient
         * @param {CreatePatientDto} createPatientDto 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        patientsControllerCreate(createPatientDto: CreatePatientDto, options?: RawAxiosRequestConfig): AxiosPromise<void> {
            return localVarFp.patientsControllerCreate(createPatientDto, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get all patients
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        patientsControllerFindAll(options?: RawAxiosRequestConfig): AxiosPromise<void> {
            return localVarFp.patientsControllerFindAll(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get a patient by ID
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        patientsControllerFindOne(id: string, options?: RawAxiosRequestConfig): AxiosPromise<void> {
            return localVarFp.patientsControllerFindOne(id, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * PatientsApi - object-oriented interface
 * @export
 * @class PatientsApi
 * @extends {BaseAPI}
 */
export class PatientsApi extends BaseAPI {
    /**
     * 
     * @summary Create a new patient
     * @param {CreatePatientDto} createPatientDto 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PatientsApi
     */
    public patientsControllerCreate(createPatientDto: CreatePatientDto, options?: RawAxiosRequestConfig) {
        return PatientsApiFp(this.configuration).patientsControllerCreate(createPatientDto, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Get all patients
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PatientsApi
     */
    public patientsControllerFindAll(options?: RawAxiosRequestConfig) {
        return PatientsApiFp(this.configuration).patientsControllerFindAll(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Get a patient by ID
     * @param {string} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PatientsApi
     */
    public patientsControllerFindOne(id: string, options?: RawAxiosRequestConfig) {
        return PatientsApiFp(this.configuration).patientsControllerFindOne(id, options).then((request) => request(this.axios, this.basePath));
    }
}



/**
 * UsersApi - axios parameter creator
 * @export
 */
export const UsersApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Create a new user (admin only)
         * @param {CreateUserDto} createUserDto 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        usersControllerCreate: async (createUserDto: CreateUserDto, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'createUserDto' is not null or undefined
            assertParamExists('usersControllerCreate', 'createUserDto', createUserDto)
            const localVarPath = `/api/users`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearer required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(createUserDto, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Create a new admin user (admin only)
         * @param {CreateUserDto} createUserDto 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        usersControllerCreateAdmin: async (createUserDto: CreateUserDto, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'createUserDto' is not null or undefined
            assertParamExists('usersControllerCreateAdmin', 'createUserDto', createUserDto)
            const localVarPath = `/api/users/admin`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearer required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(createUserDto, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Get all users (admin only)
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        usersControllerFindAll: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/users`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearer required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Get a user by ID
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        usersControllerFindOne: async (id: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('usersControllerFindOne', 'id', id)
            const localVarPath = `/api/users/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication bearer required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * UsersApi - functional programming interface
 * @export
 */
export const UsersApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = UsersApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary Create a new user (admin only)
         * @param {CreateUserDto} createUserDto 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async usersControllerCreate(createUserDto: CreateUserDto, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.usersControllerCreate(createUserDto, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['UsersApi.usersControllerCreate']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary Create a new admin user (admin only)
         * @param {CreateUserDto} createUserDto 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async usersControllerCreateAdmin(createUserDto: CreateUserDto, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.usersControllerCreateAdmin(createUserDto, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['UsersApi.usersControllerCreateAdmin']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary Get all users (admin only)
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async usersControllerFindAll(options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.usersControllerFindAll(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['UsersApi.usersControllerFindAll']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary Get a user by ID
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async usersControllerFindOne(id: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.usersControllerFindOne(id, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['UsersApi.usersControllerFindOne']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * UsersApi - factory interface
 * @export
 */
export const UsersApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = UsersApiFp(configuration)
    return {
        /**
         * 
         * @summary Create a new user (admin only)
         * @param {CreateUserDto} createUserDto 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        usersControllerCreate(createUserDto: CreateUserDto, options?: RawAxiosRequestConfig): AxiosPromise<void> {
            return localVarFp.usersControllerCreate(createUserDto, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Create a new admin user (admin only)
         * @param {CreateUserDto} createUserDto 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        usersControllerCreateAdmin(createUserDto: CreateUserDto, options?: RawAxiosRequestConfig): AxiosPromise<void> {
            return localVarFp.usersControllerCreateAdmin(createUserDto, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get all users (admin only)
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        usersControllerFindAll(options?: RawAxiosRequestConfig): AxiosPromise<void> {
            return localVarFp.usersControllerFindAll(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get a user by ID
         * @param {string} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        usersControllerFindOne(id: string, options?: RawAxiosRequestConfig): AxiosPromise<void> {
            return localVarFp.usersControllerFindOne(id, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * UsersApi - object-oriented interface
 * @export
 * @class UsersApi
 * @extends {BaseAPI}
 */
export class UsersApi extends BaseAPI {
    /**
     * 
     * @summary Create a new user (admin only)
     * @param {CreateUserDto} createUserDto 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public usersControllerCreate(createUserDto: CreateUserDto, options?: RawAxiosRequestConfig) {
        return UsersApiFp(this.configuration).usersControllerCreate(createUserDto, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Create a new admin user (admin only)
     * @param {CreateUserDto} createUserDto 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public usersControllerCreateAdmin(createUserDto: CreateUserDto, options?: RawAxiosRequestConfig) {
        return UsersApiFp(this.configuration).usersControllerCreateAdmin(createUserDto, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Get all users (admin only)
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public usersControllerFindAll(options?: RawAxiosRequestConfig) {
        return UsersApiFp(this.configuration).usersControllerFindAll(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Get a user by ID
     * @param {string} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public usersControllerFindOne(id: string, options?: RawAxiosRequestConfig) {
        return UsersApiFp(this.configuration).usersControllerFindOne(id, options).then((request) => request(this.axios, this.basePath));
    }
}



