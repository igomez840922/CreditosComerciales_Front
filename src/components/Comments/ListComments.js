import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Container,
    Row,
} from "reactstrap";

export const ListComments = (props) => {

    const { t, i18n } = useTranslation();
    console.log("props:", props.comments);
    let [...comments] = props.comments.comments;

    console.group("Comments")
    console.log(comments);
    console.groupEnd()

    return (
        (comments.map((comment, key) => (
            <Container key={key}
            >
                <Row className="mt-4">
                    <div
                        className="d-flex flex-row pb-3"
                    >
                        <img src="https://bootdey.com/img/Content/avatar/avatar1.png" width="40" height="40" className="rounded-circle me-2">
                        </img>
                        <div className="w-100">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex flex-row align-items-center">
                                    <span className="ms-2">{comment.user}</span>
                                </div> <small>{comment.atStartComment}</small>
                            </div>
                            <p className="text-justify comment-text mb-0 ms-2">
                                {comment.textComment}
                            </p>
                            <div className="d-flex flex-row user-feed mt-2">
                                <span className="ms-2" style={{ cursor: "pointer" }}><i className="mdi mdi-reply"></i>{t("Reply")}</span>
                                <span className="ms-3" style={{ cursor: "pointer" }}><i className="mdi mdi-delete-forever"></i>{t("Delete")}</span>
                            </div>
                        </div>
                    </div>
                    {
                        comment.responses.map((response, key) => (
                            <div
                                className="d-flex flex-row ps-5"
                                key={key}
                            >
                                <img src="https://i.pravatar.cc/40" width="40" height="40" className="rounded-circle me-2">
                                </img>
                                <div className="w-100">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex flex-row align-items-center">
                                            <span className="ms-2">{response.user}</span>
                                        </div> <small>{response.atStartComment}</small>
                                    </div>
                                    <p className="text-justify comment-text mb-0 ms-2">
                                        {response.textComment}
                                    </p>
                                    <div className="d-flex flex-row user-feed mt-2 mb-4">
                                        <span className="ms-1" style={{ cursor: "pointer" }}><i className="mdi mdi-delete-forever "></i>{t("Delete")}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                    <hr className="dashed"></hr>
                </Row>

            </Container>
        ))
        )
    )
}
