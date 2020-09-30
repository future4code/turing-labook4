import * as jwt from 'jsonwebtoken';

export class Authenticator {
  private static EXPIRES_IN = "1min";

  private static getExpiresIn(): number {
    return Number(process.env.ACCESS_TOKEN_EXPIRES_IN);
  }

  public generateToken(input: AuthenticationData, expiresIn: string = process.env.ACCESS_TOKEN_EXPIRES_IN as string): string {
    const token = jwt.sign({
      id: input.id,
      device: input.device
    },
    process.env.JWT_KEY as string,
    {
      expiresIn
    });
    return token
  }
  
  public verify(token: string): AuthenticationData {
    const data = jwt.verify(
      token,
      process.env.JWT_KEY as string
    ) as any;
    return {
      id: data.id
    }
  }
}

interface AuthenticationData {
  id: string,
  device?: string
}