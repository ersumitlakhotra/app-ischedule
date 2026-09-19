import { Tag } from "antd";

const Services = ({ servicesItem, servicesList }) => {
    return (
        servicesItem !== null &&
        servicesList.filter(a =>
            servicesItem.some(b => b === a.id)
        ).map(c => <Tag key={c.id} color="cyan" bordered={false}>{c.name}</Tag>)
    )
}
export default Services;