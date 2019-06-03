import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

class Form extends React.Component {

    // REACT call order when an instance of a component (Form) is created and inserted into DOM:
    // 1) contructor()
    // 2) static getDerivedStateFromProps()
    // 3) render()
    // 4) componentDidMount()

    constructor(props) {
        super(props);

        this.state = {
            title: '',
            body: '',
            author: '',
            category: '',
        };

        this.handleChangeField = this.handleChangeField.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        const { articleToEdit } = this.props;
        const { title, body, author, category } = this.state;

        return (
            <div className="col-12 col-lg-6 offset-lg-3">
                <input
                    onChange={(ev) => this.handleChangeField('title', ev)}
                    className="form-control my-3 fantasy-form"
                    placeholder="Article Title"
                    value={title}
                />
                <textarea
                    onChange={(ev) => this.handleChangeField('body', ev)}
                    className="form-control my-3 fantasy-form"
                    placeholder="Article Description"
                    value={body}>
                </textarea>
                <input
                    onChange={(ev) => this.handleChangeField('author', ev)}
                    className="form-control my-3 fantasy-form"
                    placeholder="Article Author"
                    value={author}
                />
                <select
                    value={category}
                    onChange={(ev) => this.handleChangeField('category', ev)}
                    className="form-control my-3 fantasy-form">
                    <option value="Artifacts">Artifacts</option>
                    <option value="Creatures">Creatures</option>
                    <option value="Magicks">Magicks</option>
                    <option value="Monsters">Monsters</option>
                    <option value="People">People</option>
                    <option value="Places">Places</option>
                    <option value="Religion">Religion</option>
                    <option value="Tales">Tales</option>
                </select>
                <button
                    onClick={this.handleSubmit}
                    className="btn btn-fantasy-primary float-right">
                    {articleToEdit ? 'Update' : 'Submit'}
                </button>
            </div>
        );
    }

    handleChangeField(key, event) {
        this.setState({
            [key]: event.target.value,
        });
    }

    handleSubmit() {
        const { onSubmit, articleToEdit, onEdit } = this.props;
        const { title, body, author, category } = this.state;

        if (!articleToEdit) {
            return axios.post('http://localhost:8000/api/articles', {
                title,
                body,
                author,
                category,
            }).then((res) => onSubmit(res.data))
                .then(() => this.setState({ title: '', body: '', author: '', category: '' }));
        } else {
            console.log("article edit flagged and reached to patch send!");
            return axios.patch(('http://localhost:8000/api/articles/' + encodeURIComponent(articleToEdit._id)), { title, body, author, category })
                .then((res) => onEdit(res.data))
                    .then(() => this.setState({ title: '', body: '', author: '', category: '' }));
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.articleToEdit) {
            this.setState({
                title: nextProps.articleToEdit.title,
                body: nextProps.articleToEdit.body,
                author: nextProps.articleToEdit.author,
                category: nextProps.articleToEdit.category,
            });
        }
    }
}

const mapDispatchToProps = dispatch => ({
    onSubmit: data => dispatch({ type: 'SUBMIT_ARTICLE', data }),
    onEdit: data => dispatch({ type: 'EDIT_ARTICLE', data}),
});

const mapStateToProps = state => ({
    articleToEdit: state.home.articleToEdit,
});

export default connect(mapStateToProps, mapDispatchToProps)(Form);