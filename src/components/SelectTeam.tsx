import { Select } from 'antd';
import { BaseOptionType } from 'antd/lib/select';
import React from 'react';
const { Option } = Select;

export type Match = {
  match_id: number;
  home_team: {
    home_team_id: number;
    home_team_name: string;
  };
  away_team: {
    away_team_id: number;
    away_team_name: string;
  };
  home_score: number;
  away_score: number;
};

type Props = {
  handleChange: (value: number, option: BaseOptionType) => void;
  options: Match[];
};
const SelectTeam: React.FC<Props> = ({ handleChange, options }) => {
  return (
    <>
      <Select
        defaultValue={options[0].match_id}
        onChange={handleChange}
        style={{ width: 240 }}
      >
        {options.map((match) => (
          <Option value={match.match_id} key={match.match_id}>
            {match.home_team.home_team_name} ({match.home_score} -{match.away_score})
            {match.away_team.away_team_name}
          </Option>
        ))}
      </Select>
    </>
  );
};

export default SelectTeam;
