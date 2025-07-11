import knex from '../knexfile.js';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';

export const registerUser = async (req, res) => {
    console.log("registerUser route");
    try {
        const { email, username, first_name, last_name, password } = req.body;
        if (!email || !username || !first_name || !last_name || !password) {
            res.status(400).json({ msg: "Request should contain non-empty 'email', 'username', 'first_name' and 'last_name'  fields." });
            return;
        }

        let addedUser;
        await knex.transaction(async trx => {
            [addedUser] = await trx("users")
                .insert({ email, username, first_name, last_name }, ['id', 'email', 'username', 'first_name', 'last_name']);

            const hash = await bcrypt.hash(password, 10);
            await trx("hashpwd")
                .insert({ username, password: hash });
        })
        res.status(201).json({ msg: `User was registered`, addedUser });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Database error (register user)." });
    }
};

export const loginUser = async (req, res) => {
    console.log("loginUser route");
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ msg: "Request should contain non-empty 'username' and 'password' fields." });
            return;
        }

        const [record] = await knex('hashpwd').select("password").where({ username });
        if (!record) {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        const isValid = await bcrypt.compare(password, record.password);
        if (isValid) {
            res.json({ msg: "Authorized" });
            return
        }
        res.status(401).json({ msg: "Unauthorized" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Database error (login user)." });
    }
};

export const getAllUsers = async (req, res) => {
    console.log("getAllUsers route");
    try {
        const rows = await knex('users').select('id', 'email', 'username', 'first_name', 'last_name');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Database error (get all users)." });
    };
};

export const getUserById = async (req, res) => {
    console.log("getUserById route");
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ msg: "Request should contain non-empty 'id' field." });
        return;
    };

    try {
        const rows = await knex('users').select('id', 'email', 'username', 'first_name', 'last_name').where('id', id);

        if (rows.length === 0) {
            res.status(404).json({ msg: `User with id ${id} not found.` });
            return;
        };

        res.json(rows[0]);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Database error (get user by ID.)" });
    };
};

export const updateUserById = async (req, res) => {
    console.log("updateUserById route");
    try {
        const { id } = req.params;
        const { email, username, first_name, last_name, password } = req.body;
        
        const parsedId = parseInt(id, 10);
        if (isNaN(parsedId)) {
            return res.status(400).json({ msg: "ID should be a valid number." });
        }
        if (!email || !username || !first_name || !last_name) {
            res.status(400).json({ msg: "Request should contain numeric 'id', and non-empty 'email', 'username', 'first_name' and 'last_name' fields." });
            return;
        }

        const userRows = await knex('users').select('username').where('id', id);
        if (userRows.length === 0) {
            return res.status(404).json({ msg: `User with ID ${id} not found.` });
        }
        const oldUsername = userRows[0].username;

        let updatedUser;
        await knex.transaction(async trx => {
            [updatedUser] = await trx('users')
                .where('id', id)
                .update({
                    email,
                    username,
                    first_name,
                    last_name
                }, ['id', 'email', 'username', 'first_name', 'last_name']);

            const hashpwdUpdate = { username };
            if (password) {
                const hash = await bcrypt.hash(password, 10);
                hashpwdUpdate.password = hash;
            }
            await trx('hashpwd')
                .where('username', oldUsername)
                .update(hashpwdUpdate);
        })
        res.status(200).json({ msg: `User with ID ${id} was updated`, updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Database error (update user by ID)." });
    }
};