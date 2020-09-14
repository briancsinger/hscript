const DescriptionItem = ({ descriptionItems = [] }) => {
    const renderLinkItem = (item, index) => (
        <p>
            <a href={item.url} target="_blank" referrer="self">
                {item.url}
            </a>
        </p>
    );

    const renderTextItem = (item, index) => {
        return <p>{item.text}</p>;
    };
    const renderItem = (item, index) => {
        switch (item.type) {
            case 'link':
                return renderLinkItem(item, index);
            case 'text':
                return renderTextItem(item, index);
            default:
                return;
        }
    };

    const itemsList = descriptionItems.map((item, index) => (
        <div key={index}>{renderItem(item, index)}</div>
    ));

    return <div>{itemsList}</div>;
};

export default DescriptionItem;
