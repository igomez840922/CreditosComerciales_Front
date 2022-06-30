import InboxResultModel from "../../models/InformeGestion/InboxResultModel";
const defaultResponseHandler = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response.json();
};

export default class ApiServicesInformeGestion {
    getInboxList(criteria) {
        return fetch("/api/bpm/informegestion/inboxresult", { method: 'POST' })
            .then(defaultResponseHandler)
            .then((data) => {
                // parse results
                return data.map(item => InboxResultModel.fromJson(item));
            });
    }
}
