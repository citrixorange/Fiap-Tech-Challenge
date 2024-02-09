import { config } from "../config/global_config";

export function testHttpStatusCodes(status_code: string): number {
    switch(status_code) {
        case "CONFLICT":
            return 409;
        case "BAD_REQUEST":
            return 400;
        case "NOT_FOUND":
            return 404;
        default:
            return 500;
    }
}