import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
    Col,
    Container,
    Form,
    FormGroup,
    Row,
    Input,
    Button,
} from "reactstrap";
import { ListComments } from "./ListComments";

import "./stylesComments.css";
import { commentsDB } from "./DummyDataTable"

const NewComment = (props) => {

    const { t, i18n } = useTranslation();
    const [comments, setComments] = useState(commentsDB);
 
    console.group("Database structure test")
    console.log(comments);
    console.groupEnd()

    const [newComment, setnewComment] = useState("");

    const handleAddNewComment = (evt) => {
        console.log(evt.target.value);
    }

    const handleSubmitAddComment = (evt) => {
        evt.preventDefault();
        console.log(`handle submit comment working! ${comments}`);
    }

    return (
        <Container>
            <Row>
                <Col md={5}>
                    <div className="wrapper__comments--title-avatar">
                        <h5 className="mb-2">{t("New comment")}</h5>
                        <img className="img-responsive avatar" src="https://bootdey.com/img/Content/avatar/avatar1.png" alt=""></img>
                    </div>
                </Col>
                <Col md={7}>
                    <Form onSubmit={handleSubmitAddComment}>
                        <FormGroup>
                            <Button className="float-md-end mb-2">{t("Send comment")}</Button>
                            <Input
                                id="textComment"
                                name="textComment"
                                type="textarea"
                                placeholder={t("add a comment")}
                                rows="5"
                                onChange={handleAddNewComment}
                            />
                        </FormGroup>
                    </Form>
                </Col>
            </Row>
            <Row>
                <h5 className="mt-5">{t("Comments")}</h5>
                <hr></hr>
                <Col>
                    <ListComments
                        comments={comments}
                    />
                </Col>
            </Row>
        </Container>

    )
}

export default NewComment;