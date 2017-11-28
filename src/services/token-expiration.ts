import {Injectable} from "@angular/core";

@Injectable()
export class TokenExpiration {

  isTokenExpired(token, offsetSeconds ?: number) {
    let date = this.getTokenExpirationDate(token);
    offsetSeconds = offsetSeconds || 0;
    if (date === null) {
      return false;
    }
    return !(date.valueOf() > new Date().valueOf() + offsetSeconds * 1000);
  }

  getTokenExpirationDate(token) {
    let decoded;
    decoded = this.decodeToken(token);
    if (!decoded.hasOwnProperty('exp')) {
      return null;
    }
    let date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  decodeToken(token) {
    let parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('The inspected token doesn\'t appear to be a JWT. Check to make sure it has three parts and see https://jwt.io for more.');
    }
    let decoded = this.urlBase64Decode(parts[1]);
    if (!decoded) {
      throw new Error('Cannot decode the token.');
    }
    return JSON.parse(decoded);
  }

  base64Decode(str) {
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';
    str = String(str).replace(/=+$/, '');
    if (str.length % 4 === 1) {
      throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
    }
    for (
      // initialize result and counters
      let bc = 0, bs = void 0, buffer = void 0, idx = 0;
      // get next character
      (buffer = str.charAt(idx++));
      // character found in table? initialize bit storage and add its ascii value;
      ~buffer &&
      ((bs = bc % 4 ? bs * 64 + buffer : buffer),
        // and if not first of each 4 characters,
        // convert the first 8 bits to one ascii character
      bc++ % 4)
        ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0) {
      // try to find character in table (0-63, not found => -1)
      buffer = chars.indexOf(buffer);
    }
    return output;
  }

  urlBase64Decode(str) {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0: {
        break;
      }
      case 2: {
        output += '==';
        break;
      }
      case 3: {
        output += '=';
        break;
      }
      default: {
        throw 'Illegal base64url string!';
      }
    }
    return this.b64DecodeUnicode(output);
  }

  b64DecodeUnicode(str) {
    return decodeURIComponent(Array.prototype.map
      .call(this.base64Decode(str), function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''));
  }

}
