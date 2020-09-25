import { BaseDatabase } from "./BaseDatabase";

export class RefreshTokenDatabase extends BaseDatabase {
    private static TABLE_NAME = "labook_refresh_token";

    public convertBooleanToInt(boolean: boolean): number {
        if(boolean === true) {
            return 1
        } else {
            return 0
        }
    }

    public convertIntToBoolean(number: number): boolean {
        if(number === 1) {
            return true
        } else {
            return false
        }
    }

    public async createRefreshToken (
        token: string,
        device: string,
        isActive: boolean,
        userId: string
    ): Promise<void> {
        await this.getConnection().insert({
            refresh_token: token,
            device,
            is_active: this.convertBooleanToInt(isActive),
            user_id: userId
        })
        .into(RefreshTokenDatabase.TABLE_NAME)
    }

    public async getRefreshToken(token: string): Promise<any> {
        const result = await this.getConnection().raw(`
            SELECT * FROM ${RefreshTokenDatabase.TABLE_NAME}
            WHERE refresh_token = ${token}
        `);
        const retrieveToken = result[0][0]

        return {
            token: retrieveToken.refresh_token,
            device: retrieveToken.device,
            isActive: this.convertIntToBoolean(retrieveToken.is_active),
            userId: retrieveToken.user_id
        }
    }

    public async getRefreshTokenByIdAndDevice(id: string, device: string): Promise<any> {
        const result = await this.getConnection().raw(`
            SELECT * FROM ${RefreshTokenDatabase.TABLE_NAME}
            WHERE user_id = "${id}"
            AND device = "${device}"
        `);

        const retrieveToken = result[0][0]

        if(retrieveToken === undefined) {
            return undefined;
        }

        return {
            token: retrieveToken.refresh_token,
            device: retrieveToken.device,
            isActive: this.convertIntToBoolean(retrieveToken.is_active),
            userId: retrieveToken.user_id
        }
    }

    public async deleteToken(token: string): Promise<any> {
        await this.getConnection()
        .from(RefreshTokenDatabase.TABLE_NAME)
        .where({refresh_token: token})
        .del()
    }
}