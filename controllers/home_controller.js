const express = require('express')
const home = express.Router()
const pool = require("../db")


const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
        return next()
    } else {
        res.redirect('/sessions/login')
    }
}

home.use(isAuthenticated)
// get all posts
home.get('/explore', isAuthenticated, async(req, res) => {
    try {
        const post = await pool.query("SELECT * FROM posts ORDER by post_id ASC;")

        let allPosts = post.rows.reverse();
        // console.log(allPosts);
        // console.log(req.session.currentUser[0]);
        const queryUsersData = await pool.query("SELECT * FROM usernames;")
        // console.log(queryUsersData["rows"]);
        let allUsernames = []
        for (let index in queryUsersData["rows"]) {
            // allUsernames.push(queryUsersData["rows"][index]["username"])
            allUsernames.push(queryUsersData["rows"][index]["username"])
        }
        // console.log("allusernames: ", allUsernames);

        // queries for the comments of the explore section (all posts)
        let allComments = []
        const queryAllCommentsData = await pool.query("SELECT * FROM comments;")
        for (let comment of queryAllCommentsData["rows"]) {
            // console.log(comment);
            allComments.push(comment)
        }

        // check if user has liked the post
        const queryCheckIfLiked = await pool.query("SELECT * FROM likes WHERE username = $1", [req.session.currentUser[0]])

        let allLikes = []

        for (let likeEntry of queryCheckIfLiked["rows"]) {
            allLikes.push(likeEntry["post_id"])
        }

        // queries for who has liked the post
        let listOfPostsUsersLiked = [];
        const querySeeAllLikesList = await pool.query("SELECT * FROM likes ORDER by username;")
        // console.log(querySeeAllLikesList["rows"]);
        for (let entry of querySeeAllLikesList["rows"]) {
            listOfPostsUsersLiked.push(entry)
        }


        //sorts the followers by post_id
        allPosts.sort((a, b) => {
            return b.post_id - a.post_id;
        });

        // console.log(listOfPostsUsersLiked);
        let currentUserFollowList = []
        const queryForPeopleIFollow = await pool.query("SELECT * FROM followers WHERE username = $1", [req.session.currentUser[0]])

        for (let entry of queryForPeopleIFollow["rows"]) {
            currentUserFollowList.push(entry["following"])
        }
        // console.log("people I follow", currentUserFollowList);
        const queryAllUsers = await pool.query("SELECT * FROM usernames;")
        let allUsersList = []
        for (let usernameEntry of queryAllUsers["rows"]) {
            if (usernameEntry["username"]!=req.session.currentUser[0]) {
                allUsersList.push(usernameEntry["username"])
            }
        }
        res.render('explore.ejs', {
            allPosts: allPosts,
            username: req.session.currentUser[0],
            allUsernames: allUsernames,
            allComments: allComments,
            allLikes: allLikes,
            listOfPostsUsersLiked: listOfPostsUsersLiked,
            currentUserFollowList: currentUserFollowList,
            currentUser: req.session.currentUser[0],
            allUsersList: allUsersList
        })
    }
    catch (err) {
        console.error(err.message);
    }

})

home.get('/profile', isAuthenticated, (req, res) => {
    let currentUser = req.session.currentUser[0]
    res.redirect(`/${currentUser}`)
})



// get your feed depending on the users you're following
home.get('/', isAuthenticated, async(req, res) => {
    try {
        const queryFeedPosts = await pool.query("SELECT * FROM followers WHERE username = $1", [req.session.currentUser[0]])

        let posts = [];
        let allComments = []
        // console.log(queryFeedPosts["rows"]);

        for (let rowData of queryFeedPosts["rows"]) {

            const followedPost = await pool.query("SELECT * FROM posts WHERE username = $1 ORDER by post_id DESC", [rowData["following"]])

            // console.log(followedPost);
            // console.log(rowData["following"]);
            // console.log(followedPost["rows"]);
            // posts.push(followedPost["rows"])

            for (let post of followedPost["rows"]) {
                posts.unshift(post);
                // console.log(post);
                const queryComments = await pool.query("SELECT * FROM comments WHERE post_id = $1", [post.post_id] )

                for (let comment of queryComments["rows"]) {
                    allComments.push(comment)
                    // console.log(comment);
                }
            }

        }


        posts.sort((a, b) => {
            return b.post_id - a.post_id;
        });
        // console.log(posts);

        // check if user has liked the post
        const queryCheckIfLiked = await pool.query("SELECT * FROM likes WHERE username = $1", [req.session.currentUser[0]])

        let allLikes = []

        for (let likeEntry of queryCheckIfLiked["rows"]) {
            allLikes.push(likeEntry["post_id"])
        }

        // queries for who has liked the post
        let listOfPostsUsersLiked = [];
        const querySeeAllLikesList = await pool.query("SELECT * FROM likes ORDER by username;")
        // console.log(querySeeAllLikesList["rows"]);
        for (let entry of querySeeAllLikesList["rows"]) {
            listOfPostsUsersLiked.push(entry)
        }
        // console.log(listOfPostsUsersLiked);


        //sorts the followers by post_id
        posts.sort((a, b) => {
            return b.post_id - a.post_id;
        });

        // console.log(listOfPostsUsersLiked);


        let currentUserFollowList = []
        const queryForPeopleIFollow = await pool.query("SELECT * FROM followers WHERE username = $1", [req.session.currentUser[0]])

        for (let entry of queryForPeopleIFollow["rows"]) {
            currentUserFollowList.push(entry["following"])
        }

        let currentUser = req.session.currentUser[0]

        const queryAllUsers = await pool.query("SELECT * FROM usernames;")
        let allUsersList = []
        for (let usernameEntry of queryAllUsers["rows"]) {
            if (usernameEntry["username"]!=req.session.currentUser[0]) {
                allUsersList.push(usernameEntry["username"])
            }
        }
        // console.log(req.session);

        res.render('homeFeed.ejs', {
            posts: posts,
            allComments: allComments,
            allLikes: allLikes,
            listOfPostsUsersLiked: listOfPostsUsersLiked,
            currentUserFollowList: currentUserFollowList,
            currentUser: req.session.currentUser[0],
            allUsersList: allUsersList
        })



    } catch (err) {
        console.error(err.message)
    }
})

//shows user profile
home.get(`/:username`, isAuthenticated, async(req, res) => {
    try {
        //queries for data for posts made by req.params.username
        const queryData = await pool.query("SELECT * FROM posts WHERE username = $1 ORDER by post_id DESC",[req.params.username])

        let allPosts = queryData["rows"]

        let postsLength = allPosts.length
        // console.log(allPosts);
        // console.log(req.session.currentUser[0]);
        const checkIfFollowed = await pool.query("SELECT * FROM followers WHERE username=$1 AND following = $2", [req.session.currentUser[0], req.params.username])
        // console.log(checkIfFollowed["rows"]);
        // 0 render follow button
        // 1 render unfollow button
        // 2 render nothing
        let whichButtonToRender;
        if (req.session.currentUser[0] === req.params.username) {
            whichButtonToRender = 2;
        } else if (checkIfFollowed["rows"].length > 0) {
            whichButtonToRender = 1;
        } else if (checkIfFollowed["rows"].length === 0) {
            whichButtonToRender = 0;
        }

        // checks how many people the user is following

        const obtainingFollowingList = await pool.query("SELECT * FROM followers WHERE username = $1", [req.params.username])

        let followingList = []
        for (let user of obtainingFollowingList["rows"]) {
            followingList.push(user["following"])
        }

        let followingListLength = followingList.length;

        //get the number of followers
        const obtainingFollowersList = await pool.query("SELECT * FROM followers WHERE following = $1", [req.params.username])


        let followersList = []

        for (let follower of obtainingFollowersList["rows"]) {
            followersList.push(follower["username"])
        }

        let followersListLength = followersList.length



        const checkIfUserExists = await pool.query("SELECT * FROM usernames;")
        // console.log(checkIfUserExists);
        let allUsers = []
        for (let entry of checkIfUserExists["rows"]) {
            allUsers.push(entry["username"])
        }

        let renderPage;
        if (allUsers.includes(req.params.username)) {
            renderPage = true;
        } else {
            renderPage = false;
        }

        const queryAllUsers = await pool.query("SELECT * FROM usernames;")
        let allUsersList = []
        for (let usernameEntry of queryAllUsers["rows"]) {
            if (usernameEntry["username"]!=req.session.currentUser[0]) {
                allUsersList.push(usernameEntry["username"])
            }
        }


        res.render('userProfile.ejs', {
            username: req.params.username,
            allPosts: allPosts,
            currentUser: req.session.currentUser[0],
            whichButtonToRender: whichButtonToRender,
            followerLength: followersListLength,
            followingLength: followingListLength,
            postsLength: postsLength,
            renderPage: renderPage,
            allUsersList: allUsersList

        })

    } catch (err) {
        console.error("this is the error", err.message)
    }



})








module.exports = home;
