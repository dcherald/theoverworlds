export default (state = {articles: []}, action) => {
    switch (action.type) {
        case 'HOME_PAGE_LOADED':
            return {
                ...state,
                articles: action.data.articles,
            };
        case 'SUBMIT_ARTICLE':
            return {
                ...state,
                articles: ([action.data.article]).concat(state.articles),
            }
        case 'DELETE_ARTICLE':
            return {
                ...state,
                articles: state.articles.filter((article) => article._id !== action.id),
            };
        case 'SET_EDIT':
            return {
                ...state,
                articleToEdit: action.article,
            };
        case 'EDIT_ARTICLE':
            return {
                ...state,
                articles: state.articles.map((article) => {
                    if (article._id === action.data.article._id) {
                        return {
                            ...action.data.article,
                        }
                    }
                    return article;
                }),
                articleToEdit: undefined,
            };
        case 'FILTER_ARTICLES':
            return {
                ...state,
                articles: state.articles.filter((article) =>
                    (article.title.toLowerCase().includes(action.searchTerm.toLowerCase())) ||
                    (article.body.toLowerCase().includes(action.searchTerm.toLowerCase()))),
            };
        case 'SORT_ARTICLES_RELEVANCE':
            //sort search result articles by relevance to search term.
            //Priority is given to perfect matching titles, followed by occurrences throughout all bodies,
            //with preference given to occurrences in titles.
            return {
                ...state,
                articles: action.data.articles.sort(function (a, b) {
                    let searchTerm = action.searchTerm.toLowerCase();
                    let relevanceScoreA = 0;
                    let relevanceScoreB = 0;
                    //console.log("sorting " + a.title + " and " + b.title + "...");
                    //if title is exact match, sort highest
                    if (a.title.toLowerCase() == searchTerm) {
                        //console.log("perfect match for " + searchTerm);
                        return -1;
                    }
                    else if (b.title.toLowerCase() == searchTerm) {
                        return 1;
                    }
                    //otherwise, tally occurrences in title, body, author, category and then sort.
                    else {
                        //title matches count double
                        relevanceScoreA += ((a.title.match(new RegExp(searchTerm, "gi")) || []).length) * 2;
                        relevanceScoreB += ((b.title.match(new RegExp(searchTerm, "gi")) || []).length) * 2;
                        relevanceScoreA += ((a.body.match(new RegExp(searchTerm, "gi")) || []).length);
                        relevanceScoreB += ((b.body.match(new RegExp(searchTerm, "gi")) || []).length);
                        relevanceScoreA += ((a.author.match(new RegExp(searchTerm, "gi")) || []).length);
                        relevanceScoreB += ((b.author.match(new RegExp(searchTerm, "gi")) || []).length);
                        relevanceScoreA += ((a.category.match(new RegExp(searchTerm, "gi")) || []).length);
                        relevanceScoreB += ((b.category.match(new RegExp(searchTerm, "gi")) || []).length);
                        //subtract score A from score B. If result is negative, A has greater score and gets sorted first
                        //console.log(a.title + " ranks " + (relevanceScoreB - relevanceScoreA) + " compared to " + b.title);
                        return (relevanceScoreB - relevanceScoreA);
                    }
                }),
            };
        case 'READ_MORE_ARTICLE':
            return {
                ...state,
                articles: state.articles.map((article) => {
                    if (article._id === action.data.article._id) {
                        return {
                            ...action.data.article,
                        }
                    }
                    return article;
                }),
                articleToEdit: undefined,
            };
        default:
            return state;
    }
};