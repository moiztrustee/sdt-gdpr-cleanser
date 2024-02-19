import * as luxon from 'luxon';
import {DateTime, Duration} from 'luxon';
import KSUID from 'ksuid';

export type Lookup = {
    bucket: string;
    folder: string
}

export type Process = {
    ident: string,
    run?: 'dry' | 'publish',
    numOfDays: number
    lookup: Lookup[]
    ignoreList: string[]
}

export const Scheduled = (now: DateTime = luxon.DateTime.now().toUTC()): Process => {
    return {
      ident: KSUID.randomSync().string,
      run: 'publish',
      numOfDays: 180,
      lookup: [
        {
          "bucket": "ts-vw-fs-review-data-export-reports-dev",
          "folder": "publish"
        }
      ],
      ignoreList: [
        "process.json"
      ]
    };
}