require('json5/lib/require');
const { convertResultToStatInk } = require('./stat-ink');
const getDefaultResult = require('./example-result');

describe('convertResultToStatInk', () => {
  it('should add 1000p on a victory if turf', async () => {
    const result = getDefaultResult();
    result.player_result.game_paint_point = 123;
    result.my_team_result.key = 'victory';
    result.rule.key = 'turf_war';

    const res = await convertResultToStatInk(result, true);

    expect(res.my_point).toEqual(result.player_result.game_paint_point + 1000);
  });
  it('should not add 1000p on a victory if ranked', async () => {
    const result = getDefaultResult();
    result.player_result.game_paint_point = 123;
    result.my_team_result.key = 'victory';
    result.rule.key = 'tower_control';

    const res = await convertResultToStatInk(result, true);

    expect(res.my_point).toEqual(result.player_result.game_paint_point);
  });
  it('should not add 1000p on a defeat', async () => {
    const result = getDefaultResult();
    result.player_result.game_paint_point = 123;
    result.my_team_result.key = 'defeat';

    const res = await convertResultToStatInk(result, true);

    expect(res.my_point).toEqual(result.player_result.game_paint_point);
  });

  it('should add 1000p to teammates on a victory', async () => {
    const result = getDefaultResult();
    result.my_team_members[0].game_paint_point = 123;
    result.my_team_result.key = 'victory';

    const res = await convertResultToStatInk(result, true);
    expect(res.players[1].point).toEqual(
      result.my_team_members[0].game_paint_point + 1000
    );
  });
  it('should not add 1000p to teammates on a victory if ranked', async () => {
    const result = getDefaultResult();
    result.my_team_members[0].game_paint_point = 123;
    result.my_team_result.key = 'victory';
    result.rule.key = 'tower_control';

    const res = await convertResultToStatInk(result, true);

    expect(res.players[1].point).toEqual(
      result.my_team_members[0].game_paint_point
    );
  });

  it('should not add 1000p to teammates on a victory', async () => {
    const result = getDefaultResult();
    result.my_team_members[0].game_paint_point = 123;
    result.my_team_result.key = 'defeat';

    const res = await convertResultToStatInk(result, true);

    expect(res.players[1].point).toEqual(
      result.my_team_members[0].game_paint_point
    );
  });

  it('should not insert rank if user udemae name is null', async () => {
    const result = getDefaultResult();
    result.player_result.player.udemae.name = null;

    const res = await convertResultToStatInk(result, true);

    expect(res.players[0].rank).toBeUndefined();
  });

  it('should insert rank if user udemae name is not null', async () => {
    const result = getDefaultResult();
    result.player_result.player.udemae.name = 'B-';

    const res = await convertResultToStatInk(result, true);

    expect(res.players[0].rank).toEqual('b-');
  });

  it('should not insert rank if teammate udemae name is null', async () => {
    const result = getDefaultResult();
    result.my_team_members[0].player.udemae.name = null;

    const res = await convertResultToStatInk(result, true);

    expect(res.players[1].rank).toBeUndefined();
  });

  it('should insert rank if teammate udemae name is not null', async () => {
    const result = getDefaultResult();
    result.my_team_members[0].player.udemae.name = 'B-';

    const res = await convertResultToStatInk(result, true);

    expect(res.players[1].rank).toEqual('b-');
  });

  it('should insert my team count if 0', async () => {
    const result = getDefaultResult();
    result.other_team_count = 100;
    result.my_team_count = 0;

    const res = await convertResultToStatInk(result, true);

    expect(res.my_team_count).toEqual(0);
  });

  it('should insert other team count if 0', async () => {
    const result = getDefaultResult();
    result.other_team_count = 0;
    result.my_team_count = 100;

    const res = await convertResultToStatInk(result, true);

    expect(res.his_team_count).toEqual(0);
  });

  it('should insert knockout=yes if other team count is 100', async () => {
    const result = getDefaultResult();
    result.other_team_count = 100;
    result.my_team_count = 0;

    const res = await convertResultToStatInk(result, true);
    expect(res.knock_out).toEqual('yes');
  });

  it('should insert knockout=yes if my team count is 100', async () => {
    const result = getDefaultResult();
    result.other_team_count = 0;
    result.my_team_count = 100;

    const res = await convertResultToStatInk(result, true);

    expect(res.knock_out).toEqual('yes');
  });

  it('should insert knockout=no if my team count is 100', async () => {
    const result = getDefaultResult();
    result.other_team_count = 80;
    result.my_team_count = 55;

    const res = await convertResultToStatInk(result, true);

    expect(res.knock_out).toEqual('no');
  });

  it('should set player to "no" if player not in crown list', async () => {
    const result = getDefaultResult();
    result.crown_players = [];
    const res = await convertResultToStatInk(result, true);
    expect(res.players[0].top_500).toEqual('no');
  });

  it('should set player to "yes" if player in crown list', async () => {
    const result = getDefaultResult();
    result.crown_players = [result.player_result.player.principal_id];
    const res = await convertResultToStatInk(result, true);
    expect(res.players[0].top_500).toEqual('yes');
  });
});
