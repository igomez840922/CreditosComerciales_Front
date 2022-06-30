import { useTranslation } from "react-i18next";

import Breadcrumbs from "../../../components/Common/Breadcrumb";
import Calender from "../../Calendar/";

const Scheduler = () => {
    const { t, i18n } = useTranslation();

    return (
        // <div className="page-content">
        //     <Breadcrumbs
        //         title={t("Menu")}
        //         breadcrumbItem={t("Scheduler")}
        //     />
        // </div>
        <Calender           
        />
    )
}

export default Scheduler;