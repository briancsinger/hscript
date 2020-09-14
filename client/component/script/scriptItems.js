const ScriptItems = ({ items = [] }) => {
    const renderLinkItem = (item, index) => (
        <p>
            <a href={item.url} target="_blank" referrer="self">
                {item.url}
            </a>
        </p>
    );

    const renderItem = (item, index) => {
        switch (item.type) {
            case 'question':
            case 'text':
                return <p>{item.text}</p>;
            default:
                return;
        }
    };

    const itemsList = items.map((item, index) => (
        <div key={index}>{renderItem(item, index)}</div>
    ));

    return <div>{itemsList}</div>;
};

export default ScriptItems;
