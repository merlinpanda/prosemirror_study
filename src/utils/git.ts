// import { createHash } from "crypto";
import { SHA1 } from "crypto-js";

class Git {
  /**
   * 将字符串转为二进制字符串
   * @param text
   * @returns string
   */
  static textToBinary(text: string) {
    return Buffer.from(text, "utf8").toString("binary");
  }

  /**
   * 计算文本hash
   *
   * @param text
   * @returns
   */
  static calculateHash(text: string) {
    // 计算文本二进制字符串
    const binary = Git.textToBinary(text);

    // 获取文本二进制长度
    const binary_length = binary.length;

    // 计算hash
    // const hash = createHash("sha1");
    // hash.update("blob " + binary_length + "\0" + text);
    // return hash.digest("hex");

    return SHA1("blob " + binary_length + "\0" + text).toString();
  }
}

export default Git;
