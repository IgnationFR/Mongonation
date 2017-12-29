# Mongonation

### Full example
```ts
import { Model, Property, Array, Pre, Post, Required, Unique, Instance, Static } from "mongonation";
import { Document } from "mongoose";

@Model
class User {

    public static model: Model<User & Document>;

    @Unique
    @Required()
    @Property
    public email: string;

    @Required()
    @Property
    public password: string;

    @Property
    public createdAt: Date;

    @Array("User")
    public friends: User[];

    @Instance
    public hashPassword(this: User & Document) {
        // Hash this.password;
    }

    @Static
    public findByEmail(this: Model<User & Document>, email: string) {
        return this.find({ email });
    }

    @Pre("save")
    private preSave(this: User & Document, next: (error?: Error): void) {
        this.createdAt = new Date();
        next();
    }

};

const UserModel = User.model;

const promise = UserModel.findByEmail("user@mail.com");

const user = new UserModel({
    email: "user@mail.com",
    password: "P4ssw0rd",
});

user.hashPassword();

const promiseSave = user.save();
```
