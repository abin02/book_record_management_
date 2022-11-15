const { UserModel, BookModel } = require("../models");


exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find();

    if (users.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No users found",
        });
    }
    res.status(200).json({
        success: true,
        data: users,
    })
};

exports.getSingleUserById = async (req, res) => {
    const { id } = req.params;
    const user = await UserModel.findById({ _id: id });
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
};

exports.createNewUser = async (req, res) => {
    const { data } = req.body;

    const newUser = await UserModel.create(data);


    return res.status(201).json({
        success: true,
        data: newUser,
    });
};

exports.updateUserById = async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    const UpdatedUserData = await UserModel.findOneAndUpdate(
        {
            _id: id,
        },
        {
            $set: {
                ...data,
            },
        },
        {
            new: true,
        }
    );
    if (!UpdatedUserData) {
        return res.status(404).json({
            success: false,
            message: "User id not found",
        });
    }

    return res.status(200).json({
        success: true,
        data: UpdatedUserData,
    });
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    const user = await UserModel.deleteOne({ _id: id });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User to be deleted not found",
        });
    }

    return res.status(202).json({
        success: true,
        message: "Deleted the user successfully",
    });
};

exports.getSubscriptionDetailsById = async (req, res) => {
    const { id } = req.params;
    const user = await UserModel.findById(id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    const getDateInDays = (data = "") => {
        let date;
        if (data === "") {
            date = new Date();
        }
        else {
            date = new Date(data);
        }

        let days = Math.floor(date / (1000 * 24 * 60 * 60));
        return days;
    };

    const subscriptionType = (date) => {
        if (user.subscriptionType === "Basic") {
            date = date + 90;
        } else if (user.subscriptionType === "Standard") {
            date = date + 180;
        } else if (user.subscriptionType === "Premium") {
            date = date + 365;
        }
        return date;
    };

    // Subscription expiration calculation
    let returnDate = getDateInDays(user.returnDate);
    let currentDate = getDateInDays();
    let subscriptionDate = getDateInDays(user.subscriptionDate);
    let subscriptionExpiration = subscriptionType(subscriptionDate);

    const data = {
        ...user._doc,
        subscriptionExpired: currentDate > subscriptionExpiration,
        daysLeftForExpiration:
            currentDate >= subscriptionExpiration
                ? 0 : subscriptionExpiration - currentDate,
        fine:
            returnDate < currentDate
                ? subscriptionExpiration > currentDate
                    ? 100
                    : 200
                : 0,
    }
    return res.status(200).json({
        success: true,
        data: data,
    })
}