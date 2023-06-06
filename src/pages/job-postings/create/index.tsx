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
import { createJobPosting } from 'apiSdk/job-postings';
import { Error } from 'components/error';
import { jobPostingValidationSchema } from 'validationSchema/job-postings';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { BusinessOrganizationInterface } from 'interfaces/business-organization';
import { getUsers } from 'apiSdk/users';
import { UserInterface } from 'interfaces/user';
import { getBusinessOrganizations } from 'apiSdk/business-organizations';
import { JobPostingInterface } from 'interfaces/job-posting';

function JobPostingCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: JobPostingInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createJobPosting(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<JobPostingInterface>({
    initialValues: {
      title: '',
      description: '',
      business_organization_id: (router.query.business_organization_id as string) ?? null,
      job_application: [],
    },
    validationSchema: jobPostingValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Job Posting
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="title" mb="4" isInvalid={!!formik.errors?.title}>
            <FormLabel>Title</FormLabel>
            <Input type="text" name="title" value={formik.values?.title} onChange={formik.handleChange} />
            {formik.errors.title && <FormErrorMessage>{formik.errors?.title}</FormErrorMessage>}
          </FormControl>
          <FormControl id="description" mb="4" isInvalid={!!formik.errors?.description}>
            <FormLabel>Description</FormLabel>
            <Input type="text" name="description" value={formik.values?.description} onChange={formik.handleChange} />
            {formik.errors.description && <FormErrorMessage>{formik.errors?.description}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<BusinessOrganizationInterface>
            formik={formik}
            name={'business_organization_id'}
            label={'Select Business Organization'}
            placeholder={'Select Business Organization'}
            fetcher={getBusinessOrganizations}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
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
  entity: 'job_posting',
  operation: AccessOperationEnum.CREATE,
})(JobPostingCreatePage);
