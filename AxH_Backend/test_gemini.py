import ai_router
import traceback

print("Testing AI Router initialization...")
print("AI Ready?", ai_router.is_ai_ready())

print("\nTesting route_intent...")
try:
    res = ai_router.route_intent("What is my balance?")
    print("Result:", res)
except Exception as e:
    print("Error in route_intent:")
    traceback.print_exc()

print("\nTesting FAQ generator...")
try:
    res = ai_router.generate_faq_response("Tell me about savings")
    print("Result:", res)
except Exception as e:
    print("Error in generate_faq_response:")
    traceback.print_exc()
