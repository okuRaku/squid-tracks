import React from 'react';
import {
  Card,
  ButtonGroup,
  ButtonToolbar,
  Button,
  Table,
  Container,
  Col,
  Row,
} from 'react-bootstrap';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { sort } from './sort-array';
import TableHeader from './table-header';

class StageCard extends React.Component {
  state = {
    percent: true,
    sortColumn: 'total_percent',
    sortDirection: 'up',
  };

  showCount = () => {
    this.setState({ percent: false });
  };

  showPercent = () => {
    this.setState({ percent: true });
  };

  getCalculatedStats(stage_stats) {
    let rm_win = 0,
      rm_lose = 0,
      tc_win = 0,
      tc_lose = 0,
      sz_win = 0,
      sz_lose = 0,
      cb_win = 0,
      cb_lose = 0;
    const summary = {};
    Object.keys(stage_stats).forEach((stage) => {
      summary[stage] = {};
      summary[stage].total_win =
        stage_stats[stage].hoko_win +
        stage_stats[stage].area_win +
        stage_stats[stage].yagura_win +
        stage_stats[stage].asari_win;
      summary[stage].total_lose =
        stage_stats[stage].hoko_lose +
        stage_stats[stage].area_lose +
        stage_stats[stage].yagura_lose +
        stage_stats[stage].asari_lose;
      summary[stage].total_percent =
        summary[stage].total_win /
        (summary[stage].total_win + summary[stage].total_lose);
      summary[stage].hoko_percent =
        stage_stats[stage].hoko_win /
        (stage_stats[stage].hoko_win + stage_stats[stage].hoko_lose);
      summary[stage].yagura_percent =
        stage_stats[stage].yagura_win /
        (stage_stats[stage].yagura_win + stage_stats[stage].yagura_lose);
      summary[stage].area_percent =
        stage_stats[stage].area_win /
        (stage_stats[stage].area_win + stage_stats[stage].area_lose);
      summary[stage].asari_percent =
        stage_stats[stage].asari_win /
        (stage_stats[stage].asari_win + stage_stats[stage].asari_lose);
      rm_win += stage_stats[stage].hoko_win;
      rm_lose += stage_stats[stage].hoko_lose;
      tc_win += stage_stats[stage].yagura_win;
      tc_lose += stage_stats[stage].yagura_lose;
      sz_win += stage_stats[stage].area_win;
      sz_lose += stage_stats[stage].area_lose;
      cb_win += stage_stats[stage].asari_win;
      cb_lose += stage_stats[stage].asari_lose;
    });
    const rm_percent = rm_win / (rm_win + rm_lose);
    const tc_percent = tc_win / (tc_win + tc_lose);
    const sz_percent = sz_win / (sz_win + sz_lose);
    const cb_percent = cb_win / (cb_win + cb_lose);
    const total_win = rm_win + tc_win + sz_win + cb_win;
    const total_lose = rm_lose + tc_lose + sz_lose + cb_lose;
    const total_percent = total_win / (total_win + total_lose);

    return {
      rm_win,
      rm_lose,
      tc_win,
      tc_lose,
      sz_win,
      sz_lose,
      cb_win,
      cb_lose,
      rm_percent,
      tc_percent,
      sz_percent,
      cb_percent,
      total_win,
      total_lose,
      total_percent,
      summary,
    };
  }

  messages = defineMessages({
    sz: {
      id: 'stageCard.header.splatzones',
      defaultMessage: 'SZ',
    },
    tc: {
      id: 'stageCard.header.towercontrol',
      defaultMessage: 'TC',
    },
    rm: {
      id: 'stageCard.header.rainmaker',
      defaultMessage: 'RM',
    },
    cb: {
      id: 'stageCard.header.clamblitz',
      defaultMessage: 'CB',
    },
    total: {
      id: 'stageCard.header.total',
      defaultMessage: 'Total',
    },
  });

  columnHeaders = [
    {
      text: this.props.intl.formatMessage(this.messages.sz),
      sortColumn: 'area_percent',
      sortDirection: 'up',
    },
    {
      text: this.props.intl.formatMessage(this.messages.tc),
      sortColumn: 'yagura_percent',
      sortDirection: 'up',
    },
    {
      text: this.props.intl.formatMessage(this.messages.rm),
      sortColumn: 'hoko_percent',
      sortDirection: 'up',
    },
    {
      text: this.props.intl.formatMessage(this.messages.cb),
      sortColumn: 'asari_percent',
      sortDirection: 'up',
    },
    {
      text: this.props.intl.formatMessage(this.messages.total),
      sortColumn: 'total_percent',
      sortDirection: 'up',
    },
  ];

  render() {
    const { stage_stats = {} } = this.props.records;

    const calcStats = this.getCalculatedStats(stage_stats);
    const stageStats = [];
    Object.keys(stage_stats).forEach((stage) =>
      stageStats.push({ ...stage_stats[stage], ...calcStats.summary[stage] })
    );
    sort(stageStats, this.state.sortColumn, this.state.sortDirection);

    return (
      <Card className={this.props.className}>
        <Card.Header>
          <FormattedMessage
            id="StageCard.title.v2"
            defaultMessage="Ranked and League Stage Stats"
          />
        </Card.Header>
        <Card.Body>
          <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
            <Row>
              <Col sm={12} md={12}>
                <ButtonToolbar style={{ marginBottom: '10px' }}>
                  <ButtonGroup>
                    <Button
                      variant="outline-secondary"
                      onClick={this.showPercent}
                      active={this.state.percent}
                    >
                      <FormattedMessage
                        id="StageCard.button.percent"
                        defaultMessage="Percent"
                      />
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={this.showCount}
                      active={!this.state.percent}
                    >
                      <FormattedMessage
                        id="StageCard.button.count"
                        defaultMessage="Count"
                      />
                    </Button>
                  </ButtonGroup>
                </ButtonToolbar>
                <FormattedMessage
                  id="StageCard.sortHelp"
                  defaultMessage="* Click on column headers to sort by win percent"
                />
              </Col>
            </Row>
            <Row>
              <Col sm={12} md={12}>
                <Table size="sm" striped bordered hover>
                  <thead>
                    <tr>
                      <th>
                        <FormattedMessage
                          id="StageCard.header.name"
                          defaultMessage="Name"
                        />
                      </th>
                      {this.columnHeaders.map((header) => (
                        <TableHeader
                          key={header.text}
                          setState={this.setState.bind(this)}
                          sort={{
                            sortColumn: header.sortColumn,
                            sortDirection: header.sortDirection,
                          }}
                          text={header.text}
                          sortColumn={this.state.sortColumn}
                        />
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stageStats.map((stage, index) => {
                      return (
                        <tr key={stage.stage.name}>
                          <td>{stage.stage.name}</td>
                          <td>
                            {this.state.percent
                              ? isFinite(stage.area_percent)
                                ? `${(stage.area_percent * 100).toFixed(1)}%`
                                : '---'
                              : `${stage.area_win} - ${stage.area_lose}`}
                          </td>
                          <td>
                            {this.state.percent
                              ? isFinite(stage.yagura_percent)
                                ? `${(stage.yagura_percent * 100).toFixed(1)}%`
                                : '---'
                              : `${stage.yagura_win} - ${stage.yagura_lose}`}
                          </td>
                          <td>
                            {this.state.percent
                              ? isFinite(stage.hoko_percent)
                                ? `${(stage.hoko_percent * 100).toFixed(1)}%`
                                : '---'
                              : `${stage.hoko_win} - ${stage.hoko_lose}`}
                          </td>
                          <td>
                            {this.state.percent
                              ? isFinite(stage.asari_percent)
                                ? `${(stage.asari_percent * 100).toFixed(1)}%`
                                : '---'
                              : `${stage.asari_win} - ${stage.asari_lose}`}
                          </td>
                          <td>
                            {this.state.percent
                              ? isFinite(stage.total_percent)
                                ? `${(stage.total_percent * 100).toFixed(1)}%`
                                : '---'
                              : `${stage.total_win} - ${stage.total_lose}`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th>
                        <FormattedMessage
                          id="StageCard.header.total"
                          defaultMessage="Total"
                        />
                      </th>
                      <td>
                        {this.state.percent
                          ? isFinite(calcStats.sz_percent)
                            ? `${(calcStats.sz_percent * 100).toFixed(1)}%`
                            : '---'
                          : `${calcStats.sz_win} - ${calcStats.sz_lose}`}
                      </td>
                      <td>
                        {this.state.percent
                          ? isFinite(calcStats.tc_percent)
                            ? `${(calcStats.tc_percent * 100).toFixed(1)}%`
                            : '---'
                          : `${calcStats.tc_win} - ${calcStats.tc_lose}`}
                      </td>
                      <td>
                        {this.state.percent
                          ? isFinite(calcStats.rm_percent)
                            ? `${(calcStats.rm_percent * 100).toFixed(1)}%`
                            : '---'
                          : `${calcStats.rm_win} - ${calcStats.rm_lose}`}
                      </td>
                      <td>
                        {this.state.percent
                          ? isFinite(calcStats.cb_percent)
                            ? `${(calcStats.cb_percent * 100).toFixed(1)}%`
                            : '---'
                          : `${calcStats.cb_win} - ${calcStats.cb_lose}`}
                      </td>
                      <td>
                        {this.state.percent
                          ? isFinite(calcStats.total_percent)
                            ? `${(calcStats.total_percent * 100).toFixed(1)}%`
                            : '---'
                          : `${calcStats.total_win} - ${calcStats.total_lose}`}
                      </td>
                    </tr>
                  </tfoot>
                </Table>
              </Col>
            </Row>
          </Container>
        </Card.Body>
      </Card>
    );
  }
}

export default injectIntl(StageCard);
