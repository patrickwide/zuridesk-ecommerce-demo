import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  SimpleGrid,
  Button,
  VStack,
  HStack,
  Icon,
  Link,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import { 
  HiMail, 
  HiPhone,
  HiClock,
  HiTruck,
  HiRefresh,
  HiCreditCard,
  HiShieldCheck,
} from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';

const SupportPage = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const faqs = [
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy on all our products. Items must be unused and in their original packaging.'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3-5 business days. Express shipping (2-3 business days) is available for an additional fee.'
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Yes, we ship to most countries. International shipping times and costs vary by location.'
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also view tracking information in your order history.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept PayPal and Cash on Delivery (COD) for all orders.'
    }
  ];

  const helpTopics = [
    {
      title: 'Shipping Information',
      icon: HiTruck,
      description: 'Learn about our shipping options and delivery times'
    },
    {
      title: 'Returns & Refunds',
      icon: HiRefresh,
      description: 'Information about our return policy and refund process'
    },
    {
      title: 'Payment Options',
      icon: HiCreditCard,
      description: 'Available payment methods and billing information'
    },
    {
      title: 'Product Warranty',
      icon: HiShieldCheck,
      description: 'Details about our product warranties and guarantees'
    }
  ];

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={12}>
        {/* Header */}
        <Stack spacing={4} textAlign="center">
          <Heading
            as="h1"
            size="xl"
            color={useColorModeValue('gray.900', 'white')}
          >
            How Can We Help You?
          </Heading>
          <Text fontSize="lg" color={textColor} maxW="2xl" mx="auto">
            Find answers to common questions or get in touch with our support team
          </Text>
        </Stack>

        {/* Help Topics */}
        <Box>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            {helpTopics.map((topic, index) => (
              <Box
                key={index}
                p={6}
                bg={bgColor}
                rounded="lg"
                shadow="base"
                borderWidth="1px"
                borderColor={borderColor}
                _hover={{
                  transform: 'translateY(-2px)',
                  shadow: 'lg',
                }}
                transition="all 0.2s"
              >
                <VStack spacing={4} align="flex-start">
                  <Icon as={topic.icon} boxSize={6} color="blue.500" />
                  <Stack spacing={2}>
                    <Heading size="md">{topic.title}</Heading>
                    <Text color={textColor}>{topic.description}</Text>
                  </Stack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* Contact Options */}
        <Stack spacing={6}>
          <Heading size="lg">Contact Us</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <VStack
              p={6}
              bg={bgColor}
              rounded="lg"
              shadow="base"
              borderWidth="1px"
              borderColor={borderColor}
              spacing={4}
              align="flex-start"
            >
              <Icon as={HiMail} boxSize={6} color="blue.500" />
              <Stack spacing={1}>
                <Heading size="sm">Email Support</Heading>
                <Text color={textColor}>support@zuridesk.com</Text>
                <Text fontSize="sm">24/7 support</Text>
              </Stack>
            </VStack>

            <VStack
              p={6}
              bg={bgColor}
              rounded="lg"
              shadow="base"
              borderWidth="1px"
              borderColor={borderColor}
              spacing={4}
              align="flex-start"
            >
              <Icon as={HiPhone} boxSize={6} color="blue.500" />
              <Stack spacing={1}>
                <Heading size="sm">Phone Support</Heading>
                <Text color={textColor}>1-800-ZURIDESK</Text>
                <Text fontSize="sm">Mon-Fri, 9AM-6PM EST</Text>
              </Stack>
            </VStack>

            <VStack
              p={6}
              bg={bgColor}
              rounded="lg"
              shadow="base"
              borderWidth="1px"
              borderColor={borderColor}
              spacing={4}
              align="flex-start"
            >
              <Icon as={FaWhatsapp} boxSize={6} color="green.500" />
              <Stack spacing={1}>
                <Heading size="sm">WhatsApp Support</Heading>
                <Text color={textColor}>+254 740 194 874</Text>
                <Text fontSize="sm">Quick responses during business hours</Text>
              </Stack>
              <Button 
                as="a"
                href="https://wa.me/254740194874"
                target="_blank"
                rel="noopener noreferrer"
                size="sm" 
                colorScheme="green"
                leftIcon={<FaWhatsapp />}
              >
                Chat on WhatsApp
              </Button>
            </VStack>
          </SimpleGrid>
        </Stack>

        {/* FAQs */}
        <Stack spacing={6}>
          <Heading size="lg">Frequently Asked Questions</Heading>
          <Accordion allowMultiple>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} borderColor={borderColor}>
                <h2>
                  <AccordionButton py={4}>
                    <Box flex="1" textAlign="left" fontWeight="medium">
                      {faq.question}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} color={textColor}>
                  {faq.answer}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Stack>

        {/* Business Hours */}
        <Stack spacing={6}>
          <Heading size="lg">Business Hours</Heading>
          <Box
            p={6}
            bg={bgColor}
            rounded="lg"
            shadow="base"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <HStack spacing={4}>
              <Icon as={HiClock} boxSize={6} color="blue.500" />
              <Stack spacing={1}>
                <Text fontWeight="medium">Customer Support Hours</Text>
                <Text color={textColor}>Monday - Friday: 9:00 AM - 6:00 PM EST</Text>
                <Text color={textColor}>Saturday: 10:00 AM - 4:00 PM EST</Text>
                <Text color={textColor}>Sunday: Closed</Text>
              </Stack>
            </HStack>
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
};

export default SupportPage;