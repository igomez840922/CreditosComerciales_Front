import React, { useEffect, useState } from "react"
import { useTranslation, withTranslation } from "react-i18next"
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Button,
    Label,
    Input,
    Modal,
    Card,
    CardBody,
    CardFooter,
    InputGroup,
    Table,
} from "reactstrap"
import { Select } from 'antd';
import { AvForm, AvField, AvGroup } from "availity-reactstrap-validation"
import { Link, useHistory } from "react-router-dom";
import { CoreServices } from "../../../../../../services";
const ModalProducto = (props) => {
    const { Option } = Select;
    const history = useHistory();
    const [products, setProducts] = useState(undefined);
    const [subProductCatalogue, setsubProductCatalogue] = useState(undefined);
    const apiServiceCore = new CoreServices();
    const [productoSelect, setproductoSelect] = useState(props?.dataSet?.producto??{ Description: "", Code: "" })
    const [subProductoSelect, setsubProductoSelect] = useState(props?.dataSet?.subproducto??{ Description: "", Code: "" })
    const { t, i18n } = useTranslation();
    useEffect(() => {
        setproductoSelect(props?.dataSet?.producto)
        setsubProductoSelect(props?.dataSet?.subproducto)
        apiServiceCore.getSubProductCatalog().then(data => {
            setsubProductCatalogue(data?.Records)
        }).catch((error) => {

        });
        apiServiceCore.getProductCatalog().then(data => {
            setProducts(data?.records?.map(products => ({ Description: products.DESCRIPCION, Code: products.CODIGO })));
        }).catch((error) => {
        });
    }, [props.isOpen])
    function handleSubmit() {
        props.dataManagament({
            "tipoProducto": productoSelect?.Code ?? "",
            "descTipoProducto": productoSelect?.Description ?? "",
            "tipoSubProducto": subProductoSelect?.Code ?? "",
            "descTipoSubproducto": subProductoSelect?.Description ?? ""
        })
        setproductoSelect({ Description: "", Code: "" })
        setsubProductoSelect({ Description: "", Code: "" })
    }
    return (
        <Modal
            size="md"
            isOpen={props.isOpen}
            toggle={props.toggle}
            centered={true}>
            <div className="modal-header">
                <h5 className="modal-title mt-0">{"Nuevo producto"}</h5>
                <button
                    type="button"
                    onClick={props.toggle}
                    data-dismiss="modal"
                    className="close"
                    aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body" style={{ backgroundColor: "#f3f5f7" }}>

                <Row>
                    <Col xl="12">
                        <Card>
                            <CardBody>
                                <Row>
                                    <Col md="6">
                                        <div className="mb-4">
                                            <Label>{t("Producto")}</Label>

                                            {products && <Select noOptionsMessage={() => ""}
                                                style={{ width: "100%" }}
                                                optionFilterProp="children"
                                                defaultValue={props.dataSet.producto.Description}
                                                onChange={(e) => {
                                                    let products = JSON.parse(e);
                                                    setproductoSelect(products)
                                                    // setDataGeneral({ ...DataGeneral, productTypeCode: products.Code, productTypeDesc: products.Description })
                                                }}
                                                filterOption={(input, option) =>
                                                    option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {products?.length > 0 ?

                                                    products?.map((item, index) => (
                                                        <Option key={index} value={JSON.stringify(item)}>{item.Description}</Option>
                                                    ))
                                                    : null}
                                            </Select>}
                                        </div>
                                    </Col>

                                    <Col md="6">
                                        <div className="mb-4">
                                            <Label>{t("SubProducto")}</Label>
                                            {subProductCatalogue &&
                                                <Select noOptionsMessage={() => ""}
                                                    style={{ width: "100%" }}
                                                    optionFilterProp="children"
                                                    defaultValue={props.dataSet.subproducto.Description}
                                                    // defaultValue={JSON.stringify(subProductCatalogue?.find(subProduct => subProduct.Code === DataGeneral?.subProductTypeCode))}
                                                    onChange={(e) => {
                                                        let subProduct = JSON.parse(e)
                                                        setsubProductoSelect(subProduct)
                                                        // setDataGeneral({ ...DataGeneral, subProductTypeCode: subProduct.Code, subProductTypeDesc: subProduct.Description });
                                                    }}
                                                    filterOption={(input, option) =>
                                                        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                >
                                                    {subProductCatalogue && subProductCatalogue?.length > 0 ?

                                                        subProductCatalogue?.map((item, index) => (
                                                            <Option key={index} value={JSON.stringify(item)}>{item.Description}</Option>
                                                        ))
                                                        : null}
                                                </Select>}
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                            <CardFooter style={{ textAlign: "right" }}>
                                <Button id="btnNew" color="danger" type="button" style={{ margin: '5px' }} onClick={props.toggle} data-dismiss="modal">
                                    <i className="mdi mdi mdi-cancel mid-12px"></i>{" "}{t("Cancel")}
                                </Button>
                                <Button id="btnSearch" color="success" type="button" onClick={() => { handleSubmit() }} style={{ margin: '5px' }}><i className="mdi mdi-content-save mdi-12px"></i>
                                    {t("Save")}
                                </Button>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
            </div>
        </Modal>
    );
};


export default ModalProducto;
