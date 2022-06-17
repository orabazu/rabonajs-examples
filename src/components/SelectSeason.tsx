import React from 'react';
import { Select } from 'antd';
import { BaseOptionType } from 'antd/lib/select';
import { competitions } from 'utils/competitions';
const { Option } = Select;

type Props = {
  handleChange: (value: any, option: BaseOptionType) => void;
};
const SelectSeason: React.FC<Props> = ({ handleChange }) => {
  return (
    <>
      <Select
        defaultValue={competitions[0].competition_id + `/` + competitions[0].season_id}
        onChange={handleChange}
        style={{ width: 240 }}
      >
        {competitions.map((competition) => (
          <Option
            value={competition.competition_id + `/` + competition.season_id}
            key={competition.competition_id + `/` + competition.season_id}
          >
            {competition.competition_name} / {competition.season_name}
          </Option>
        ))}
      </Select>
    </>
  );
};

export default SelectSeason;
