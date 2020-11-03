import React from 'react';
import { makeStyles } from '@material-ui/core/styles'

interface KeyValue {
    key: (string|number);
    value: (string|number);
};

interface Props {
    entries: KeyValue[];
};

const useStyles = makeStyles({
    container: {
        display: 'grid',
    }
});

// const KeyValueGrid: React.FC<Props> = props => {
class KeyValueGrid extends React.Component {
    props: Props;

    constructor(props: Props) {
        super(props);
        this.props = props;
    }

    renderTableData() {
        return this.props.entries.map((entry) => {
            const { key, value } = entry;
            return (
                <tr>
                    <td>{key}</td>
                    <td>{value}</td>
                </tr>
            )
        })
    }

    render() {
        return (
            <table style={{width: '70%'}}>
                <tbody>
                    {this.renderTableData()}
                </tbody>
            </table>
        )
    }
}

export default KeyValueGrid;