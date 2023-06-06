import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createResume } from 'apiSdk/resumes';
import { Error } from 'components/error';
import { resumeValidationSchema } from 'validationSchema/resumes';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { JobApplicationInterface } from 'interfaces/job-application';
import { getJobApplications } from 'apiSdk/job-applications';
import { ResumeInterface } from 'interfaces/resume';

function ResumeCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: ResumeInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createResume(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ResumeInterface>({
    initialValues: {
      file_path: '',
      job_application_id: (router.query.job_application_id as string) ?? null,
    },
    validationSchema: resumeValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Resume
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="file_path" mb="4" isInvalid={!!formik.errors?.file_path}>
            <FormLabel>File Path</FormLabel>
            <Input type="text" name="file_path" value={formik.values?.file_path} onChange={formik.handleChange} />
            {formik.errors.file_path && <FormErrorMessage>{formik.errors?.file_path}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<JobApplicationInterface>
            formik={formik}
            name={'job_application_id'}
            label={'Select Job Application'}
            placeholder={'Select Job Application'}
            fetcher={getJobApplications}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.job_posting_id}
              </option>
            )}
          />
          <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'resume',
  operation: AccessOperationEnum.CREATE,
})(ResumeCreatePage);
