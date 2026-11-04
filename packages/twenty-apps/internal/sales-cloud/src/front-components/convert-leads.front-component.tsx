import { RestApiClient } from 'twenty-client-sdk/rest';
import { defineFrontComponent } from 'twenty-sdk/define';
import {
  Command,
  enqueueSnackbar,
  useSelectedRecordIds,
} from 'twenty-sdk/front-component';

import {
  CONVERT_LEADS_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  CONVERT_LEADS_LOGIC_FUNCTION,
} from 'src/constants/universal-identifiers';
import { buildConversionSnackbar } from 'src/utils/build-conversion-snackbar';
import { type ConvertLeadsResult } from 'src/utils/lead-conversion-types';

const execute = async (recordIds: string[]) => {
  try {
    const result = await new RestApiClient().post<ConvertLeadsResult>(
      `/s${CONVERT_LEADS_LOGIC_FUNCTION.path}`,
      { recordIds },
    );

    await enqueueSnackbar(buildConversionSnackbar(result));
  } catch {
    await enqueueSnackbar({
      message: 'Lead conversion failed',
      variant: 'error',
    });
  }
};

const ConvertLeads = () => {
  const recordIds = useSelectedRecordIds();

  return <Command execute={() => execute(recordIds)} />;
};

export default defineFrontComponent({
  universalIdentifier: CONVERT_LEADS_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'convert-leads-effect',
  description: 'Converts the selected leads',
  component: ConvertLeads,
  isHeadless: true,
});
