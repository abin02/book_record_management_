const express = require("express");
const { users } = require("../data/users.json");
const router = express.Router();

/*
    Route: /users
    Method: GET
    Description: gets all the users  
    Access: Public
    Parameters: None
*/

router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        data: users,
    })
})

/*
    Route: /users/id
    Method: GET
    Description: get single user by id  
    Access: Public
    Parameters: id
*/

router.get("/:id", (req, res) => {
    const { id } = req.params;
    const user = users.find((each) => each.id == id);
    if (!user) {
        res.status(404).json({
            sucess: false,
            message: "User not found",
        });
    }
    res.status(200).json({
        sucess: true,
        data: user,
    });
})

/*
    Route: /users
    Method: POST
    Description: create new user
    Access: Public
    Parameters: none
*/

router.post("/", (req, res) => {
    const { id, name, surname, email, subscriptionType, subscriptionDate } = req.body;
    const user = users.find((each) => each.id == id);
    if (user) {
        return res.status(404).json({
            sucess: false,
            message: "User exists with this id",
        })
    }

    users.push({
        id,
        name,
        surname,
        email,
        subscriptionType,
        subscriptionDate,
    });

    return res.status(201).json({
        success: true,
        data: users,
    });
});

/*
    Route: /users/:id
    Method: PUT
    Description: Updating user data
    Access: Public
    Parameters: id
*/

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    const user = users.find((each) => each.id == id)
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User id not found",
        });
    }
    users.forEach((each, i) => {
        if (each.id == id) {
            users[i] = {
                ...each,
                ...data,
            };
        }
    });

    return res.status(200).json({
        success: true,
        data: users,
    });

})

/*
    Route: /users/:id
    Method: DELETE
    Description: delete user by id
    Access: Public
    Parameters: id
*/

router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const user = users.find((each) => each.id === id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User to be deleted not found",
        });
    }
    const index = users.indexOf(user);
    users.splice(index, 1);

    return res.status(202).json({
        success: true,
        data: users,
    })
})

module.exports = router;