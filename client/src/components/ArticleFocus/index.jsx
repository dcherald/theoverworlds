import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';

import { Form } from '../../components/Article';

class ArticleFocus extends React.Component {

    // REACT call order when an instance of a component (Home) is created and inserted into DOM:
    // 1) contructor()
    // 2) static getDerivedStateFromProps()
    // 3) render()
    // 4) componentDidMount()

    constructor(props) {
        super(props);
    }

    render() {
        const { articles } = this.props;

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
                        {articles.map((article) => {
                            return (
                                <div className="card my-3 fantasy-blog-article">
                                    <div className="card-header fantasy-blog-header">
                                        <b>{article.title}</b> <p className="float-right">{article.category}</p>
                                    </div>
                                    <div className="card-body fantasy-blog-body">
                                        {article.body}
                                        <p className="mt-5 text-muted">
                                            <b>{article.author}</b> {moment(new Date(article.createdAt)).fromNow()}
                                        </p>
                                    </div>
                                    <div className="card-footer fantasy-blog-footer">
                                        <div className="row">
                                            <button
                                                onClick={() => this.handleEdit(article)}
                                                className="btn btn-fantasy-primary mx-3">
                                                Learn more
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
}

const mapStateToProps = state => ({
    articles: state.home.articles,
});

const mapDispatchToProps = dispatch => ({
    onLoad: data => dispatch({ type: 'HOME_PAGE_LOADED', data }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ArticleFocus);