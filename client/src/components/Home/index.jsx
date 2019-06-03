import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';

import { Form } from '../../components/Article';

class Home extends React.Component {

    // REACT call order when an instance of a component (Home) is created and inserted into DOM:
    // 1) contructor()
    // 2) static getDerivedStateFromProps()
    // 3) render()
    // 4) componentDidMount()

    constructor(props) {
        super(props);

        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.toggleReadMore = this.toggleReadMore.bind(this);
        //this.handleCategorySelect = this.handleCategorySelect.bind(this);

        this.state = {
            category: 'ALL',
            searchTerm: '',
        };
    }

    render() {
        const { articles } = this.props;
        const {category, searchTerm } = this.state;

        return (
            <div className="container">
                <div className="row pt-5">
                    <div className="col-12 col-lg-6 offset-lg-3 fantasy-title-container">
                        <img src="https://raw.githubusercontent.com/dcherald/theoverworlds/master/30658-Name%20banner%202.png" alt="title-banner" className="fantasy-title-image" />
                        <h1 className="text-center fantasy-title-text">Overworld: Harke</h1>
                    </div>
                    <Form />
                </div>
                <div className="row pt-5">
                    <div className="col-12 col-lg-6 offset-lg-3">
                        <button
                            onClick={() => this.handleSearch('ALL', searchTerm)}
                            className={"btn btn-fantasy-category fantasy-category-all"
                                + (category == "ALL" ? " btn-fantasy-category-selected" : "")}>
                            All
                        </button>
                        <button
                            onClick={() => this.handleSearch('ARTIFACTS', searchTerm)}
                            className={"btn btn-fantasy-category fantasy-category-artifacts"
                                + (category == "ARTIFACTS" ? " btn-fantasy-category-selected" : "")}>
                            Artifacts
                        </button>
                        <button
                            onClick={() => this.handleSearch('CREATURES', searchTerm)}
                            className={"btn btn-fantasy-category fantasy-category-creatures"
                                + (category == "CREATURES" ? " btn-fantasy-category-selected" : "")}>
                            Creatures
                        </button>
                        <button
                            onClick={() => this.handleSearch('MAGICKS', searchTerm)}
                            className={"btn btn-fantasy-category fantasy-category-magicks"
                                + (category == "MAGICKS" ? " btn-fantasy-category-selected" : "")}>
                            Magicks
                        </button>
                        <button
                            onClick={() => this.handleSearch('MONSTERS', searchTerm)}
                            className={"btn btn-fantasy-category fantasy-category-monsters"
                                + (category == "MONSTERS" ? " btn-fantasy-category-selected" : "")}>
                            Monsters
                        </button>
                        <button
                            onClick={() => this.handleSearch('PEOPLE', searchTerm)}
                            className={"btn btn-fantasy-category fantasy-category-people"
                                + (category == "PEOPLE" ? " btn-fantasy-category-selected" : "")}>
                            People
                        </button>
                        <button
                            onClick={() => this.handleSearch('PLACES', searchTerm)}
                            className={"btn btn-fantasy-category fantasy-category-places"
                                + (category == "PLACES" ? " btn-fantasy-category-selected" : "")}>
                            Places
                        </button>
                        <button
                            onClick={() => this.handleSearch('RELIGION', searchTerm)}
                            className={"btn btn-fantasy-category fantasy-category-religion"
                                + (category == "RELIGION" ? " btn-fantasy-category-selected" : "")}>
                            Religion
                        </button>
                        <button
                            onClick={() => this.handleSearch('TALES', searchTerm)}
                            className={"btn btn-fantasy-category fantasy-category-tales"
                                + (category == "TALES" ? " btn-fantasy-category-selected" : "")}>
                            Tales
                        </button>
                    </div>
                </div>
                {/*<div className="row pt-5">
                    <div className="col-12 col-lg-6 offset-lg-3">
                        <select
                            value={category}
                            onChange={(ev) => this.handleSearch(ev.target.value, searchTerm)}
                            className="form-control my-3 fantasy-form">
                            <option value="ALL">All Categories</option>
                            <option value="CREATURES">Creatures</option>
                            <option value="MAGICKS">Magicks</option>
                            <option value="MONSTERS">Monsters</option>
                            <option value="PEOPLE">People</option>
                            <option value="PLACES">Places</option>
                            <option value="RELIGION">Religion</option>
                            <option value="TALES">Tales</option>
                        </select>
                    </div>
                </div>*/}
                <div className="row pt-5 fantasy-search-container">
                    <div className="col-12 col-lg-6 offset-lg-3">
                        <input
                            value={searchTerm}
                            onChange={(ev) => this.handleSearch(category, ev.target.value)}
                            className="form-control my-3 fantasy-form"
                            placeholder="Search the scrolls..."
                        />
                    </div>
                </div>
                <div className="row pt-5">
                    <div className="col-12 col-lg-6 offset-lg-3">
                        {articles.map((article) => {
                            //Truncate article body if it is long, and add "read more" button
                            let articleBody;
                            if (article.body.length > 200) {
                                articleBody = <p> {article.readMore ? article.body : (article.body.substring(0, 200) + '...')}
                                    <br /><br/>
                                    <button
                                        onClick={() => this.toggleReadMore(article)}
                                        className="btn btn-fantasy-readmore">
                                        {article.readMore ? 'Show Less' : 'Read More...'}
                                    </button>
                                    </p>;
                            }
                            else {
                                articleBody = <p> {article.body} </p>
                            }
                            return (
                                <div className="card my-3 fantasy-blog-article">
                                    <div className="card-header fantasy-blog-header">
                                        <b>{article.title}</b>
                                        <p className="float-right fantasy-blog-category"> {article.category}</p>
                                        <div className={"float-right fantasy-blog-category-indicator fantasy-category-" + article.category.toLowerCase()} > </div>
                                    </div>
                                    <div className="card-body fantasy-blog-body">
                                        {articleBody}
                                        
                                        <p className="mt-5 text-muted">
                                            <b>{article.author}</b> {moment(new Date(article.createdAt)).fromNow()}
                                        </p>
                                    </div>
                                    <div className="card-footer fantasy-blog-footer">
                                        <div className="row">
                                            <button
                                                onClick={() => this.handleEdit(article)}
                                                className="btn btn-fantasy-primary mx-3">
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => this.handleDelete(article._id)}
                                                className="btn btn-fantasy-danger">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        const { onLoad } = this.props;

        axios('http://localhost:8000/api/articles').then((res) => onLoad(res.data));
    }

    handleDelete(id) {
        const { onDelete } = this.props;

        return axios.delete('http://localhost:8000/api/articles/' + encodeURIComponent(id)).then(() => onDelete(id));
    }

    handleEdit(article) {
        const { setEdit } = this.props;
        setEdit(article);
    }

    handleSearch(category, searchTerm) {
        const { onLoad } = this.props;
        const { sortByRelevance } = this.props;

        this.setState({
            ['category']: category,
            ['searchTerm']: searchTerm,
        });

        if (searchTerm && searchTerm != "") {
            axios.get('http://localhost:8000/api/articles/search', {
                params: {
                    category: category,
                    searchTerm: searchTerm
                }
            }).then((res) => sortByRelevance(res.data, searchTerm))
                .then((res) => onLoad(res.data));
        }
        else {
            axios('http://localhost:8000/api/articles', { params: { category: category } })
                .then((res) => onLoad(res.data));     
        }
    }

    toggleReadMore(articleToFlag) {
        articleToFlag.readMore = !articleToFlag.readMore;
        this.forceUpdate();
    }
}

const mapStateToProps = state => ({
    articles: state.home.articles,
});

const mapDispatchToProps = dispatch => ({
    onLoad: data => dispatch({ type: 'HOME_PAGE_LOADED', data }),
    onDelete: id => dispatch({ type: 'DELETE_ARTICLE', id }),
    setEdit: article => dispatch({ type: 'SET_EDIT', article }),
    sortByRelevance: (data, searchTerm) => dispatch({ type: 'SORT_ARTICLES_RELEVANCE', data, searchTerm }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);