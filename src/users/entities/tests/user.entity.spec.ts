import { User } from "../user.entity";
import * as bcrypt from "bcrypt";

describe("UserEntity", () => {
  it("should hash password before insert", async () => {
    const user = new User();
    user.password = "plainTextPassword";

    expect(user.password).toEqual("plainTextPassword");

    await user.hashPassword();

    expect(user.password).not.toEqual("plainTextPassword");
    expect(bcrypt.compare(user.password, "plainTextPassword")).toBeTruthy();
  });
});
