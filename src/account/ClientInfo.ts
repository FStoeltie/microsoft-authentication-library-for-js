/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ClientAuthError } from "../error/ClientAuthError";
import { StringUtils } from "../utils/StringUtils";
import { ICrypto } from "../crypto/ICrypto";
import { Separators } from "../utils/Constants";

/**
 * Client info object which consists of two IDs. Need to add more info here.
 */
export type ClientInfo = {
    uid: string,
    utid: string
};

/**
 * Function to build a client info object
 * @param rawClientInfo
 * @param crypto
 */
export function buildClientInfo(rawClientInfo: string, crypto: ICrypto): ClientInfo {
    if (StringUtils.isEmpty(rawClientInfo)) {
        throw ClientAuthError.createClientInfoEmptyError();
    }

    try {
        const decodedClientInfo: string = crypto.base64Decode(rawClientInfo);
        return JSON.parse(decodedClientInfo) as ClientInfo;
    } catch (e) {
        throw ClientAuthError.createClientInfoDecodingError(e);
    }
}

export function buildClientInfoFromHomeAccountId(homeAccountId: string): ClientInfo {
    const clientInfoParts: string[] = homeAccountId.split(Separators.CLIENT_INFO_SEPARATOR);
    if (clientInfoParts.length < 2) {
        throw ClientAuthError.createClientInfoDecodingError("Home account ID was malformed.");
    }
    return {
        uid: clientInfoParts[0],
        utid: clientInfoParts[1]
    };
}
