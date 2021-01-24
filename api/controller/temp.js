const client = require("./dbConnect");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const url = require('url');


exports.get_reviews = (req, res, next) => {
    const queryObject = url.parse(req.url, true).query;
    const status = queryObject.status;
    const customerId = queryObject.customerId;
    const productId = queryObject.productId;
    const nrVotes = queryObject.nrVotes;
    const defaultStatus = "accepted";

    const date = getDate().split("/");
    var links = new Object;
    var embedded = new Object;


    if (productId != undefined) {
        links.self = new Object;
        links.next = new Object;
        links.start = new Object;
        links.previous = new Object;
        links.self.href = "https://reviews-psidi.herokuapp.com/reviews?productId=" + productId;
        links.next.href = "https://reviews-psidi.herokuapp.com/reviews?productId=" + productId + "&page=2";
        links.start.href = "https://reviews-psidi.herokuapp.com/reviews?productId=" + productId + "&page=1";
        links.previous.href = "https://reviews-psidi.herokuapp.com/reviews?productId=" + productId + "&page=1";
        if (nrVotes == undefined) {
            client
                .query('SELECT * FROM reviews.reviews WHERE "objectid" = $1 AND "status" = $2', [productId, defaultStatus])
                .then(docs => {
                    docs.rows.sort(function(a, b) {
                        return (a.publishingdate < b.publishingdate) ? -1 : ((a.publishingdate > b.publishingdate) ? 1 : 0);
                    });
                    console.log(docs);
                    var items = [];
                    var reviews = [];
                    for (i = 0; i < docs.rows.length; i++) {
                        var links_temp = new Object;
                        var itemref = new Object;
                        itemref.href = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id;
                        items.push(itemref)
                        links_temp.self = new Object;
                        links_temp.customer = new Object;
                        links_temp.product = new Object;
                        links_temp.funnyfact = new Object;
                        links_temp.accept = new Object;
                        links_temp.reject = new Object;
                        links_temp.report = new Object;
                        links_temp.vote = new Object;
                        links_temp.self.href = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id;
                        links_temp.customer.href = "https://psidi-customers.herokuapp.com/v1/customer/" + docs.rows[i].authorid;
                        links_temp.product.href = "http://catalog-psidi.herokuapp.com/product/" + docs.rows[i].objectid;
                        links_temp.funnyfact.href = "http://numbersapi.com/" + date[1] + "/" + date[2] + "/date";
                        links_temp.accept.href = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/accepted";
                        links_temp.reject.href = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/rejected";
                        links_temp.report.href = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/report";
                        links_temp.vote.href = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/vote";
                        reviews.push(links_temp);
                    }
                    links.items = items;
                    var size = docs.rows.length;
                    embedded.reviews = reviews;
                    res.status(200).json({
                        "_links": links,
                        "size": size,
                        "_embedded": embedded
                    })
                })
                .catch(e => console.error(e.stack))
        } else {
            links.self.href = "https://reviews-psidi.herokuapp.com/reviews?productId=" + productId  + "&nrVotes=" + nrVotes;
            client
            .query('SELECT * FROM reviews.reviews WHERE "objectid" = $1 AND "status" = $2 AND "votes" = $3', [productId, defaultStatus, nrVotes])
            .then(docs => {
                docs.rows.sort(function(a, b) {
                    return (a.publishingdate < b.publishingdate) ? -1 : ((a.publishingdate > b.publishingdate) ? 1 : 0);
                });
                var items = [];
                var reviews = [];
                for (i = 0; i < docs.rows.length; i++) {
                    var links_temp = new Object;
                    var itemref = new Object;
                    itemref.href = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id;
                    items.push(itemref)
                    links_temp.self = new Object;
                    links_temp.customer = new Object;
                    links_temp.product = new Object;
                    links_temp.funnyfact = new Object;
                    links_temp.accept = new Object;
                    links_temp.reject = new Object;
                    links_temp.report = new Object;
                    links_temp.vote = new Object;
                    links_temp.self.href = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id;
                    links_temp.customer.href = "https://psidi-customers.herokuapp.com/v1/customer/" + docs.rows[i].authorid;
                    links_temp.product.href = "http://catalog-psidi.herokuapp.com/product/" + docs.rows[i].objectid;
                    links_temp.funnyfact.href = "http://numbersapi.com/" + date[1] + "/" + date[2] + "/date";
                    links_temp.accept.href = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/accepted";
                    links_temp.reject.href = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/rejected";
                    links_temp.report.href = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/report";
                    links_temp.vote.href = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/vote";
                    reviews.push(links_temp);
                }
                links.items = items;
                var size = docs.rows.length;
                embedded.reviews = reviews;
                res.status(200).json({
                    "_links": links,
                    "size": size,
                    "_embedded": embedded
                })
            })
            .catch(e => console.error(e.stack))
        }

    } else if (customerId != undefined) {
        links.self = new Object;
        links.next = new Object;
        links.start = new Object;
        links.previous = new Object;
        links.customer = new Object;
        if (status != undefined) {
            links.self.href = "https://reviews-psidi.herokuapp.com/reviews?status=" + status + "&customerId=" + customerId;
        } else {
            links.self.href = "https://reviews-psidi.herokuapp.com/reviews?customerId=" + customerId;
        }
        links.next.href = "https://reviews-psidi.herokuapp.com/reviews?customerId=" + customerId + "&page=2";
        links.start.href = "https://reviews-psidi.herokuapp.com/reviews?customerId=" + customerId + "&page=1";
        links.previous.href = "https://reviews-psidi.herokuapp.com/reviews?customerId=" + customerId + "&page=1";
        links.customer.href = "https://psidi-customers.herokuapp.com/v1/customer/" + customerId;
        client
            .query('SELECT * FROM reviews.reviews WHERE "authorid" = $1 AND "status" = $2', [customerId, defaultStatus])
            .then(docs => {
                var items = [];
                var reviews = [];
                for (i = 0; i < docs.rows.length; i++) {
                    var itemref = new Object;
                    var links_temp = new Object;
                    itemref.href = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id;
                    items.push(itemref)
                    links_temp.self = new Object;
                    links_temp.customer = new Object;
                    links_temp.product = new Object;
                    links_temp.funnyfact = new Object;
                    links_temp.accept = new Object;
                    links_temp.reject = new Object;
                    links_temp.report = new Object;
                    links_temp.vote = new Object;
                    links_temp.self.href = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id;
                    links_temp.customer.href = "https://psidi-customers.herokuapp.com/v1/customer/" + docs.rows[i].authorid;
                    links_temp.product.href = "http://catalog-psidi.herokuapp.com/product/" + docs.rows[i].objectid;
                    links_temp.funnyfact.href = "http://numbersapi.com/" + date[1] + "/" + date[2] + "/date";
                    links_temp.accept.href = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/accepted";
                    links_temp.reject.href = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/rejected";
                    links_temp.report.href = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/report";
                    links_temp.vote.href = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/vote";
                    reviews.push(links_temp);
                }
                links.items = items;
                var size = docs.rows.length;
                embedded.reviews = reviews;
                res.status(200).json({
                    "_links": links,
                    "size": size,
                    "_embedded": embedded
                })
            })
            .catch(e => console.error(e.stack))
    } else {
        links.self = new Object;
        links.next = new Object;
        links.start = new Object;
        links.previous = new Object;
        links.self.href = "https://reviews-psidi.herokuapp.com/reviews?status=" + status;
        links.next.href = "https://reviews-psidi.herokuapp.com/reviews?status=" + status + "&page=2";
        links.start.href = "https://reviews-psidi.herokuapp.com/reviews?status=" + status + "&page=1";
        links.previous.href = "https://reviews-psidi.herokuapp.com/reviews?status=" + status + "&page=1";
        client
            .query('SELECT * FROM reviews.reviews WHERE status = $1', [status])
            .then(docs => {
                var items = [];
                var reviews = [];
                for (i = 0; i < docs.rows.length; i++) {
                    var itemref = new Object;
                    var links_temp = new Object;
                    itemref.href = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id;
                    items.push(itemref)
                    links_temp.self = new Object;
                    links_temp.customer = new Object;
                    links_temp.product = new Object;
                    links_temp.funnyfact = new Object;
                    links_temp.accept = new Object;
                    links_temp.reject = new Object;
                    links_temp.report = new Object;
                    links_temp.vote = new Object;
                    links_temp.self.href = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id;
                    links_temp.customer.href = "https://psidi-customers.herokuapp.com/v1/customer/" + docs.rows[i].authorid;
                    links_temp.product.href = "http://catalog-psidi.herokuapp.com/product/" + docs.rows[i].objectid;
                    links_temp.funnyfact.href = "http://numbersapi.com/" + date[1] + "/" + date[2] + "/date";
                    links_temp.accept.href = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/accepted";
                    links_temp.reject.href = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/rejected";
                    links_temp.report.href = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/report";
                    links_temp.vote.href = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/vote";
                    reviews.push(links_temp);
                }
                links.items = items;
                var size = docs.rows.length;
                embedded.reviews = reviews;
                res.status(200).json({
                    "_links": links,
                    "size": size,
                    "_embedded": embedded
                })
            })
            .catch(e => console.error(e.stack))
    }

}

exports.post_review = (req, res, next) => {

    const date = getDate().split("/");
    const url = "http://numbersapi.com/" + date[1] + "/" + date[2] + "/date";
    const newRoute = "http://catalog-psidi.herokuapp.com/products/score/refresh?productId=" + req.body.productId + "&score=" + req.body.score;
    const Http = new XMLHttpRequest(); 
    Http.open("GET", url);
    Http.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var response = Http.responseText;
            client
                .query('CREATE SCHEMA IF NOT EXISTS "reviews"; CREATE TABLE IF NOT EXISTS "reviews"."reviews" (id SERIAL PRIMARY KEY, status VARCHAR(40) NOT NULL, score decimal NOT NULL, authorID integer NOT NULL, objectID integer NOT NULL, reviewDescription VARCHAR(250), publishingDate date, funnyFact VARCHAR(200), votes integer NOT NULL, reports integer NOT NULL, voteslist integer[] NOT NULL, reportlist integer[] NOT NULL);');
            client
                .query("INSERT INTO reviews.reviews (status, score, authorid, objectid, reviewdescription, publishingdate, funnyfact, votes, reports, voteslist, reportlist) VALUES ('pending', '" + req.body.score + "', '" + req.body.customerId + "', '" + req.body.productId + "', '" + req.body.reviewDescription + "', '" + getDate() + "', '" + response + "', '0', '0', '{}', '{}') RETURNING id")
                .then(docs => {
                    const newRequest = new XMLHttpRequest();
                    newRequest.open("GET", newRoute);
                    newRequest.onreadystatechange = function() {
                        if (this.readyState === 4 && this.status === 200) {
                            if (newRequest.responseText != undefined) {
                                console.log("sent");
                            };
                        }
                    }
                    newRequest.send();
                    res.status(202).json("https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[0].id)
                })
                .catch(e => console.error(e.stack))
        }
    }
    Http.send();
}

exports.get_review_by_ID = (req, res, next) => {
    const date = getDate().split("/");
    const queryObject = url.parse(req.url, true).query;
    const code = queryObject.code;
    const id = req.params.reviewID;
    var status = "accepted"
    if (code == "asd324") {
        client
            .query('SELECT * FROM reviews.reviews WHERE id = ' + id)
            .then(docs => {
                var review = docs.rows;
                var links = new Object;
                links.self = new Object;
                links.customer = new Object;
                links.product = new Object;
                links.accept = new Object;
                links.reject = new Object;
                links.funnyfact = new Object;
                links.report = new Object;
                links.vote = new Object;
                links.self.href = "https://reviews-psidi.herokuapp.com/reviews/" + id;
                links.accept.href = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/accepted";
                links.reject.href = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/rejected";
                links.report.href = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/report";
                links.vote.href = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/vote";
                links.funnyfact.href = "http://numbersapi.com/" + date[1] + "/" + date[2] + "/date";
                links.customer.href = "https://psidi-customers.herokuapp.com/v1/customers/" + review[0].authorid;
                links.product.href = "http://catalog-psidi.herokuapp.com/products/" + review[0].objectid;
                if ((!Array.isArray(review) || !review.length)) {
                    res.status(404).json({
                        "Message": "Review not found"
                    })
                } else {
                    res.status(200).json({
                        "_links": links,
                        "reviewdescription": review[0].reviewdescription,
                        "publishingdate": review[0].publishingdate,
                        "votes": review[0].votes,
                        "reports": review[0].reports,
                        "score": review[0].score,
                        "id": review[0].id,
                        "status": review[0].status,
                        "funnyfact": review[0].funnyfact
                    });
                }
            })
            .catch(e => console.error(e.stack))
    } else {
        client
            .query('SELECT * FROM reviews.reviews WHERE id = ' + id + ' AND "status" = $1', [status])
            .then(docs => {
                var review = docs.rows;
                if (review[0] != undefined) {
                    var links = new Object;
                    links.self = new Object;
                    links.customer = new Object;
                    links.product = new Object;
                    links.accept = new Object;
                    links.reject = new Object;
                    links.funnyfact = new Object;
                    links.report = new Object;
                    links.vote = new Object;
                    links.self.href = "https://reviews-psidi.herokuapp.com/reviews/" + id;
                    links.accept.href = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/accepted";
                    links.reject.href = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/rejected";
                    links.report.href = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/report";
                    links.vote.href = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/vote";
                    links.funnyfact.href = "http://numbersapi.com/" + date[1] + "/" + date[2] + "/date";
                    links.customer.href = "https://psidi-customers.herokuapp.com/v1/customers/" + review[0].authorid;
                    links.product.href = "http://catalog-psidi.herokuapp.com/products/" + review[0].objectid;
                    if ((!Array.isArray(review) || !review.length)) {
                        res.status(404).json({
                            "Message": "Review not found"
                        })
                    } else {
                        res.status(200).json({
                            "_links": links,
                            "reviewdescription": review[0].reviewdescription,
                            "publishingdate": review[0].publishingdate,
                            "votes": review[0].votes,
                            "reports": review[0].reports,
                            "score": review[0].score,
                            "id": review[0].id,
                            "status": review[0].status,
                            "funnyfact": review[0].funnyfact
                        });
                    }
                } else {
                    res.status(404).json({
                        "Message": "Review not found"
                    })
                }

            })
            .catch(e => console.error(e.stack))
    }

}

exports.get_pending_reviews = (req, res, next) => {
    const date = getDate().split("/");
    const status = "pending";
    var links = new Object;
    var embedded = new Object;
    links.self = new Object;
    links.next = new Object;
    links.start = new Object;
    links.previous = new Object;
    links.self.href = "https://reviews-psidi.herokuapp.com/reviews?status=" + status;
    links.next.href = "https://reviews-psidi.herokuapp.com/reviews?status=" + status + "&page=2";
    links.start.href = "https://reviews-psidi.herokuapp.com/reviews?status=" + status + "&page=1";
    links.previous.href = "https://reviews-psidi.herokuapp.com/reviews?status=" + status + "&page=1";
    client
        .query('SELECT * FROM reviews.reviews WHERE status = $1', [status])
        .then(docs => {
            var items = [];
            var reviews = [];
            var links_temp = new Object;
            for (i = 0; i < docs.rows.length; i++) {
                var itemref = new Object;
                itemref.href = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id;
                items.push(itemref)
                links_temp.self = new Object;
                links_temp.customer = new Object;
                links_temp.product = new Object;
                links_temp.funnyfact = new Object;
                links_temp.accept = new Object;
                links_temp.reject = new Object;
                links_temp.report = new Object;
                links_temp.vote = new Object;
                links_temp.self.href = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id;
                links_temp.customer.href = "https://psidi-customers.herokuapp.com/v1/customer/" + docs.rows[i].authorid;
                links_temp.product.href = "http://catalog-psidi.herokuapp.com/product/" + docs.rows[i].objectid;
                links_temp.funnyfact.href = "http://numbersapi.com/" + date[1] + "/" + date[2] + "/date";
                links_temp.accept.href = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/accepted";
                links_temp.reject.href = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/rejected";
                links_temp.report.href = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/report";
                links_temp.vote.href = "https://reviews-psidi.herokuapp.com/reviews/" + docs.rows[i].id + "/vote";
                reviews.push(links_temp);
            }
            links.items = items;
            var size = docs.rows.length;
            embedded.reviews = reviews;
            res.status(200).json({
                "_links": links,
                "size": size,
                "_embedded": embedded
            })
        })
        .catch(e => console.error(e.stack))

}

exports.report_review = (req, res, next) => {
    const id = req.params.reviewID;
    const queryObject = url.parse(req.url, true).query;
    const user = queryObject.customerId;
    client
        .query('SELECT * FROM reviews.reviews WHERE id = ' + id)
        .then(docs => {
            var array = docs.rows[0].reportlist;
            if (!array.includes(parseInt(user))) {
                var links = new Object;
                links.self = new Object;
                links.customer = new Object;
                links.product = new Object;
                links.accept = new Object;
                links.reject = new Object;
                links.self.href = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/report?customerId=" + user;
                links.accept.href = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/accept";
                links.reject.href = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/reject";
                links.customer.href = "https://psidi-customers.herokuapp.com/v1/customers/" + docs.rows[0].authorid;
                links.product.href = "http://catalog-psidi.herokuapp.com/products/" + docs.rows[0].objectid;
                var report = docs.rows[0].reports + 1;
                console.log(report);
                array.push(parseInt(user));
                client
                    .query("UPDATE reviews.reviews SET reports = " + report + ", reportlist = array_append(reportlist, " + parseInt(user) + ") WHERE id = " + id)
                    .then(docs => res.status(200).json({
                        "_links": links
                    }))
                    .catch(e => console.error(e.stack))
            } else {
                res.status(403).json({
                    "Message": "You have already reported this review"
                })
            }
        })
        .catch(e => console.error(e.stack))
}

exports.vote_review = (req, res, next) => {
    const id = req.params.reviewID;
    const queryObject = url.parse(req.url, true).query;
    const user = queryObject.customerId;
    client
        .query('SELECT * FROM reviews.reviews WHERE id = ' + id)
        .then(docs => {
            var array = docs.rows[0].voteslist;
            if (!array.includes(parseInt(user))) {
                var links = new Object;
                links.self = new Object;
                links.report = new Object;
                links.customer = new Object;
                links.product = new Object;
                links.self.href = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/vote?customerId=" + user;
                links.report.href = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/report";
                links.customer.href = "https://psidi-customers.herokuapp.com/v1/customers/" + docs.rows[0].authorid;
                links.product.href = "http://catalog-psidi.herokuapp.com/products/" + docs.rows[0].objectid;
                var votes = docs.rows[0].votes + 1;
                array.push(parseInt(user));
                client
                    .query("UPDATE reviews.reviews SET votes = " + votes + ", voteslist = array_append(voteslist, " + parseInt(user) + ") WHERE id = " + id)
                    .then(docs => res.status(200).json({
                        "_links": links
                    }))
                    .catch(e => console.error(e.stack))
            } else {
                res.status(403).json({
                    "Message": "You have already voted for this review"
                })
            }
        })
        .catch(e => console.error(e.stack))
}

exports.update_review_accepted = (req, res, next) => {
    const id = req.params.reviewID;
    client
        .query('SELECT * FROM reviews.reviews WHERE id = ' + id)
        .then(docs => {
            console.log(docs.rows);
            var links = new Object;
            links.self = new Object;
            links.report = new Object;
            links.customer = new Object;
            links.vote = new Object;
            links.product = new Object;
            links.self.href = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/accepted";
            links.report.href = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/report";
            links.vote.href = "https://reviews-psidi.herokuapp.com/reviews/" + id + "/vote";
            links.customer.href = "https://psidi-customers.herokuapp.com/v1/customers/" + docs.rows[0].authorid;
            links.product.href = "http://catalog-psidi.herokuapp.com/products/" + docs.rows[0].objectid;
            client
                .query("UPDATE reviews.reviews SET status = 'accepted' WHERE id = " + id)
                .then(docs => res.status(200).json({
                    "_links": links
                }))
                .catch(e => console.error(e.stack))
        })
        .catch(e => console.error(e.stack))
}

exports.update_review_rejected = (req, res, next) => {
    const id = req.params.reviewID;
    client
        .query('SELECT * FROM reviews.reviews WHERE id = ' + id)
        .then(docs => {
            console.log(docs.rows);
            var links = new Object;
            links.self = new Object;
            links.customer = new Object;
            links.product = new Object;
            links.self.href = "https://reviews-psidi.herokuapp.com/reviews/" + id;
            links.customer.href = "https://psidi-customers.herokuapp.com/v1/customers/" + docs.rows[0].authorid;
            links.product.href = "http://catalog-psidi.herokuapp.com/products/" + docs.rows[0].objectid;
            client
                .query("UPDATE reviews.reviews SET status = 'rejected' WHERE id = " + id)
                .then(docs => res.status(200).json({
                    "_links": links
                }))
                .catch(e => console.error(e.stack))
        })
        .catch(e => console.error(e.stack))
}

exports.get_routes = (req, res, next) => {
    var links = new Object;
    links.search = new Object;
    links.review = new Object;
    links.pending = new Object;
    links.accept = new Object;
    links.reject = new Object;
    links.vote = new Object;
    links.report = new Object;
    links.create = new Object;
    links.search.href = "https://reviews-psidi.herokuapp.com/reviews{?productId&?status&?customerId}";
    links.review.href = "https://reviews-psidi.herokuapp.com/reviews/{:id}";
    links.pending.href = "https://reviews-psidi.herokuapp.com/reviews/status/pending";
    links.accept.href = "https://reviews-psidi.herokuapp.com/reviews/{:id}/accept";
    links.reject.href = "https://reviews-psidi.herokuapp.com/reviews/{:id}/reject";
    links.vote.href = "https://reviews-psidi.herokuapp.com/reviews/{:id}/vote";
    links.report.href = "https://reviews-psidi.herokuapp.com/reviews/{:id}/report";
    links.create.href = "https://reviews-psidi.herokuapp.com/reviews";
    res.status(200).json({
        "_links": links
    });
}

exports.delete_review = (req, res, next) => {
    const id = req.params.reviewID;
    client
        .query('SELECT * FROM reviews.reviews WHERE id = ' + id)
        .then(docs => {
            if (docs.rows[0].votes == 0) {
                client
                .query('DELETE FROM reviews.reviews WHERE id = ' + id)
                .then(docs => res.status(200).json("https://reviews-psidi.herokuapp.com/reviews/" + id))
                .catch(e => console.error(e.stack))
            }
            else {
                res.status(403).json("Cannot withdraw review");
            }
        })
        .catch(e => console.error(e.stack))
    
}

function getDate() {
    var today = new Date();
    var dd = today.getDate();

    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }
    today = yyyy + '/' + mm + '/' + dd;
    return today;
}